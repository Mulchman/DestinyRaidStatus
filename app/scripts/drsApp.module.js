import angular from 'angular';

import LocalStorageModule from 'angular-local-storage';
import MessagesModule from 'angular-messages';
import RateLimiterModule from 'ng-http-rate-limiter';
import RouteModule from 'angular-route';
import SanitizeModule from 'angular-sanitize';
import TranslateModule from 'angular-translate';
import TranslateMessageFormatModule from 'angular-translate-interpolation-messageformat';
import 'angular-uuid2/dist/angular-uuid2.js';

import constants from './drsConstants';
import { HeaderComponent } from './drsHeader.component';
import { FooterComponent } from './drsFooter.component';
import { InputPlayerComponent } from './drsInputPlayer.component';
import { PlayerListComponent } from './drsPlayerList.component';
import MainController from './drsMain.controller';
import SettingsController from './drsSettings.controller';
import BungieLookupService from './services/drsBungieLookup.factory';
import InputMatcherService from './services/drsInputMatcher.factory';
import PlayerListService from './services/drsPlayerList.factory';
import QueueService from './services/drsQueue.factory';
import SettingsService from './services/drsSettings.factory';
import UtilsService from './services/drsUtilities.factory';

import drsThe100Module from './api/the100/drsThe100.module';

import config from './drsApp.config';
import routes from './drsApp.routes';
import run from './drsApp.run';

export const DrsAppModule = angular
  .module('drsApp', [
    LocalStorageModule,
    MessagesModule,
    RateLimiterModule,
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
  .component('drsHeader', HeaderComponent)
  .component('drsFooter', FooterComponent)
  .component('drsInputPlayer', InputPlayerComponent)
  .component('drsPlayerList', PlayerListComponent)
  .controller('MainCtrl', MainController)
  .controller('SettingsCtrl', SettingsController)
  .factory('BungieLookupService', BungieLookupService)
  .factory('InputMatcherService', InputMatcherService)
  .factory('PlayerListService', PlayerListService)
  .factory('QueueService', QueueService)
  .factory('SettingsService', SettingsService)
  .factory('UtilsService', UtilsService)
  .name;