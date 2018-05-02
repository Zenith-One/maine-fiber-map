import * as angular from 'angular';
import './map.component.scss'; // import my styles for this component
import * as L from 'leaflet';
import 'leaflet-geometryutil/src/leaflet.geometryutil.js';
import { GeoJSONService, ColorMap } from './geojson.service';

export const FIBERMAP_DIRECTIVE_NAME = 'fiberMap';

function getClickHandler(map: L.Map, cableLayers: any[]){
  let highlighted;

  function highlight(layer){
    layer.setStyle({
      opacity: 1,
      // garish and obvious for demo purposes
      color: '#f00'
    });
    highlighted = layer;
  }

  function unhighlight(){
    // everything's back to normal
    highlighted.setStyle({
      opacity: 0.5,
      color: highlighted.options.fillColor
    });
    highlighted = null;
  }

  function onClick(layer, popupContent){
    let latlng = layer.getLatLng();

    // create our popup and popup-ulate it
    let popup = L.popup()
      .setLatLng(latlng)
      .setContent(popupContent)
      .on('remove',onPopupRemoved);
    popup.openOn(map);

    // find the closest fiber cable and highlight it
    let closest = (L as any).GeometryUtil.closestLayer(map,cableLayers,latlng);
    let closestLayer = closest.layer;
    highlight(closestLayer);

    // inject the distance into the popup
    let distanceDisplay = closest.distance.toLocaleString('en-IN') + 'M';
    popup.setContent(`${popupContent} Nearest Fiber: ${distanceDisplay} away`);
  }

  function onPopupRemoved(e){
    // remove our highlighting
    unhighlight();
  }

  return onClick;
}

export const fiberMapDirective = (geoService: GeoJSONService) => {
  return {
    template: require('./map.component.html'),
    link: (scope: ng.IScope, element: JQuery, attr: ng.IAttributes) => {
      let map: L.Map = L.map('map', {
        center: [45.290256, -68.942153],
        zoom: 7,
        maxZoom: 20
      });

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 20}).addTo(map);

      let cableLayers: any[] = [];

      let onClick = getClickHandler(map, cableLayers);

      // we want to know the colors before we start parsing through the cables.
      geoService.getOwnerColors().then((resp) => {

        let colors: ColorMap = resp.data;

        geoService.getCableData().then((resp) => {
          L.geoJSON(resp.data, {
            // Make it pretty, or make it pretty obvious something went wrong
            style: (feature) => {
              let color = colors[feature.properties.OWNER] || '#000000';
              return { color: color, fillColor: color}
            },
            onEachFeature: (feature, layer) => {
              // because commas and truncating insignificant digits are important.
              let lengthDisplay = feature.properties.LENGTH_MET.toLocaleString('en-US') + 'M';
              layer.bindPopup(
                `<div class="cable">
                  <p class="owner">Owned by: ${feature.properties.OWNER || 'Unknown'}</p>
                  <p class="length">Length (Meters): ${lengthDisplay}</p>
                </div>`
              );
              // keep an array of all the cable layers so we can do some calculations later
              cableLayers.push(layer);
            }
          }).addTo(map);
        });
      });

      geoService.getBuildingData().then(resp => {
        // set up our dots
        var geojsonMarkerOptions = {
            radius: 6,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        L.geoJSON(resp.data, {
          // we want dots instead of images
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
          },
          onEachFeature: (feature, layer) => {
            let props = feature.properties;

            let popupContent = 
              `<div class="building">
                <p class="address-line">${props.ADDRESS}</p>
                <p class="address-line">${props.POSTAL_COM}, ${props.STATE} ${props.ZIPCODE}</p>
              </div>`;

            let clickHandler = (e) => {
              onClick(layer, popupContent);
            }
            layer.on('click',clickHandler);
          }
        }).addTo(map);
      });
    }
  };
};
fiberMapDirective.$inject = ['GeoJSONService'];