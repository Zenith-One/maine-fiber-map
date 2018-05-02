import * as angular from 'angular';

import { FIBERMAP_DIRECTIVE_NAME, fiberMapDirective } from './fiber-map.directive';
import { GEOJSONSERVICE_NAME, GeoJSONService } from './geojson.service';


const MODULE_NAME = 'map';

angular.module(MODULE_NAME, [])
  .service(GEOJSONSERVICE_NAME, GeoJSONService)
  .directive(FIBERMAP_DIRECTIVE_NAME, fiberMapDirective);

export default MODULE_NAME;