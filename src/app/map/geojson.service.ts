import * as angular from 'angular';

export const GEOJSONSERVICE_NAME = 'GeoJSONService';

export type ColorMap = { [owner: string]: string };

export class GeoJSONService {

  static $inject = ['$http'];
  constructor(private $http: ng.IHttpService){

  }

  getCableData(): ng.IPromise<ng.IHttpResponse<GeoJSON.FeatureCollection>> {
    return this.$http.get('/dist/data/cables/cables.json');
  }

  getBuildingData(): ng.IPromise<ng.IHttpResponse<GeoJSON.FeatureCollection>> {
    return this.$http.get('/dist/data/buildings/buildings.json');
  }

  getOwnerColors(): ng.IPromise<ng.IHttpResponse<ColorMap>> {
    return this.$http.get('/dist/data/colors.json');
  }

}