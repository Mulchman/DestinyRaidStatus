import angular from 'angular';

import AriaModule from 'angular-aria';
import AnimateModule from 'angular-animate';
import DialogModule from 'ng-dialog';
import LocalStorageModule from 'angular-local-storage';
import MaterialModule from 'angular-material';
import MessagesModule from 'angular-messages';
import RouteModule from 'angular-route';
import 'angular-uuid2/dist/angular-uuid2.js';

import config from './drsApp.config';
import routes from './drsApp.routes';
import run from './drsApp.run';

export const DrsAppModule = angular
  .module('drsApp', [
    AriaModule,
    AnimateModule,
    DialogModule,
    LocalStorageModule,
    MaterialModule,
    MessagesModule,
    RouteModule,
    'angularUUID2'
  ])
  .config(config)
  .config(routes)
  .run(run)
  .name;