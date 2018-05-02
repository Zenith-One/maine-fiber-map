import * as angular from 'angular';
import mapModule from './map/map.module';

import '../style/app.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

let app = () => {
  return {
    template: require('./app.html'),
    controller: 'AppCtrl',
    controllerAs: 'app'
  }
};

class AppCtrl {
  url = 'https://github.com/preboot/angular-webpack';
  constructor() {
  }
}

const MODULE_NAME = 'app';
console.log('Map module name?',mapModule);

angular.module(MODULE_NAME, [mapModule])
  .directive('app', app)
  .controller('AppCtrl', AppCtrl);

export default MODULE_NAME;