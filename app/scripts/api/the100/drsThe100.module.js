import angular from 'angular';
import { The100Service } from './drsThe100.factory';
import { The100Ctrl } from './drsThe100.controller';
import { The100Matcher } from './drsThe100.matcher';
import run from './drsThe100.run';

export default angular
  .module('drsThe100', [])
  .service('The100Service', The100Service)
  .service('The100Matcher', The100Matcher)
  .controller('The100Ctrl', The100Ctrl)
  .run(run)
  .name;