import angular from 'angular';
import template from './drsThemePicker.template.html';

function ThemePickerCtrl($document, $rootScope, SettingsService) {
  'ngInject';

  let settingsLoadedHandler;
  const vm = this;
  vm.toggleTheme = toggleTheme;

  angular.extend(vm, {
    ss: SettingsService
  });

  function initialize() {
    if (vm.ss.loaded) {
      setTheme(vm.ss.theme);
    } else {
      settingsLoadedHandler = $rootScope.$on("drs-settings-loaded", function() {
        setTheme(vm.ss.theme);
        settingsLoadedHandler();
      });
    }
  }

  function setTheme(theme) {
    const body = angular.element($document[0].body);
    if (theme === 'light') {
      body.removeClass('dark-theme');
    } else {
      body.addClass('dark-theme');
    }
    vm.ss.theme = theme;
    vm.ss.save();
  }

  function toggleTheme() {
    setTheme(vm.ss.theme === 'light' ? 'dark' : 'light');
  }

  initialize();
}

export const ThemePickerComponent = {
  controller: ThemePickerCtrl,
  template: template
};