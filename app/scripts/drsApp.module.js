import angular from 'angular';

import LocalStorageModule from 'angular-local-storage';
import MessagesModule from 'angular-messages';
import RouteModule from 'angular-route';
import SanitizeModule from 'angular-sanitize';

import config from './drsApp.config';
import routes from './drsApp.routes';
import run from './drsApp.run';

import constants from './drsConstants';

export const DrsAppModule = angular
  .module('drsApp', [
    LocalStorageModule,
    MessagesModule,
    RouteModule,
    SanitizeModule
  ])
  .config(config)
  .config(routes)
  .run(run)
  .value('Constants', constants)
  .name;