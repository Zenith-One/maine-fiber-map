import * as angular from 'angular';

export const GEOJSONSERVICE_NAME = 'GeoJSONService';

export type ColorMap = { [owner: string]: string };

// hack for github pages
const BASE_PATH = '/dist/data/'
let DATA_PATH = window['isProd'] ? '/maine-fiber-map' + BASE_PATH : BASE_PATH; 

export class GeoJSONService {

  static $inject = ['$http'];
  constructor(private $http: ng.IHttpService){

  }

  getCableData(): ng.IPromise<ng.IHttpResponse<GeoJSON.FeatureCollection>> {
    return this.$http.get(DATA_PATH + 'cables/cables.json');
  }

  getBuildingData(): ng.IPromise<ng.IHttpResponse<GeoJSON.FeatureCollection>> {
    return this.$http.get(DATA_PATH + 'buildings/buildings.json');
  }

  getOwnerColors(): ng.IPromise<ng.IHttpResponse<ColorMap>> {
    return this.$http.get(DATA_PATH + 'colors.json');
  }

}