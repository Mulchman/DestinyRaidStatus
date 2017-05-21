import angular from 'angular';

import LocalStorageModule from 'angular-local-storage';
import MessagesModule from 'angular-messages';
import RouteModule from 'angular-route';
import SanitizeModule from 'angular-sanitize';
import TranslateModule from 'angular-translate';
import TranslateMessageFormatModule from 'angular-translate-interpolation-messageformat';
import 'angular-uuid2/dist/angular-uuid2.js';

import { FooterComponent } from './drsFooter.directive';
import drsThe100Module from './api/the100/drsThe100.module';

import config from './drsApp.config';
import routes from './drsApp.routes';
import run from './drsApp.run';

import constants from './drsConstants';

export const DrsAppModule = angular
  .module('drsApp', [
    LocalStorageModule,
    MessagesModule,
    RouteModule,
    SanitizeModule,
    TranslateModule,
    TranslateMessageFormatModule,
    'angularUUID2',
    drsThe100Module
  ])
  .config(config)
  .config(routes)
  .run(run)
  .value('Constants', constants)
  .component('drsFooter', FooterComponent)
  .name;