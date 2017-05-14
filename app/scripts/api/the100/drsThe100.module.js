import angular from 'angular';
import { The100Service } from './drsThe100.factory';
import { The100Ctrl } from './drsThe100.controller';

export default angular
  .module('drsThe100', [

  ])
  .service('The100Service', The100Service)
  .controller('The100Ctrl', The100Ctrl)
  .name;