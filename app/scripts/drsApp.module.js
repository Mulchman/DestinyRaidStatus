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
import { InputGameComponent } from './drsInputGame.component';
import { InputPlayerComponent } from './drsInputPlayer.component';
import { InputPlayerD2Component } from './drsInputPlayer.D2.component';
import { PlayerListComponent } from './drsPlayerList.component';
import { PlayerListD2Component } from './drsPlayerList.D2.component';
import { ThemePickerComponent } from './drsThemePicker.component';
import MainController from './drsMain.controller';
import SettingsController from './drsSettings.controller';
import BungieLookupService from './services/drsBungieLookup.factory';
import BungieLookupD2Service from './services/drsBungieLookup.D2.factory';
import InputMatcherService from './services/drsInputMatcher.factory';
import InputMatcherD2Service from './services/drsInputMatcher.D2.factory';
import PlayerListService from './services/drsPlayerList.factory';
import PlayerListD2Service from './services/drsPlayerList.D2.factory';
import QueueService from './services/drsQueue.factory';
import SettingsService from './services/drsSettings.factory';
import UtilsService from './services/drsUtilities.factory';
import BroadcastChannelRun from './services/drsBroadcastChannel.run';

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
  .run(BroadcastChannelRun)
  .value('Constants', constants)
  .component('drsHeader', HeaderComponent)
  .component('drsFooter', FooterComponent)
  .component('drsInputGame', InputGameComponent)
  .component('drsInputPlayer', InputPlayerComponent)
  .component('drsInputPlayerD2', InputPlayerD2Component)
  .component('drsPlayerList', PlayerListComponent)
  .component('drsPlayerListD2', PlayerListD2Component)
  .component('drsThemePicker', ThemePickerComponent)
  .controller('MainCtrl', MainController)
  .controller('SettingsCtrl', SettingsController)
  .factory('BungieLookupService', BungieLookupService)
  .factory('BungieLookupD2Service', BungieLookupD2Service)
  .factory('InputMatcherService', InputMatcherService)
  .factory('InputMatcherD2Service', InputMatcherD2Service)
  .factory('PlayerListService', PlayerListService)
  .factory('PlayerListD2Service', PlayerListD2Service)
  .factory('QueueService', QueueService)
  .factory('SettingsService', SettingsService)
  .factory('UtilsService', UtilsService)
  .name;