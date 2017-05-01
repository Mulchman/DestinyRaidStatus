import angular from 'angular';

import { DrsAppModule } from './drsApp.module';
import { AppComponent } from './app.component';

export const AppModule = angular
  .module('app', [
    DrsAppModule
  ])
  .component('app', AppComponent)
  .name;