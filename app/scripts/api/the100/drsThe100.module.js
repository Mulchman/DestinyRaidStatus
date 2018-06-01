import angular from 'angular';
import { The100Service } from './drsThe100.factory';
import { The100D2Service } from './drsThe100.D2.factory';
import { The100Ctrl } from './drsThe100.controller';
import { The100Matcher } from './drsThe100.matcher';
import { The100D2Matcher } from './drsThe100.D2.matcher';
import run from './drsThe100.run';

export default angular
  .module('drsThe100', [])
  .service('The100Service', The100Service)
  .service('The100D2Service', The100D2Service)
  .service('The100Matcher', The100Matcher)
  .service('The100D2Matcher', The100D2Matcher)
  .controller('The100Ctrl', The100Ctrl)
  .run(run)
  .name;