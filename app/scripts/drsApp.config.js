import en from '../i18n/drs_en.json';
import it from '../i18n/drs_it.json';
import de from '../i18n/drs_de.json';
import fr from '../i18n/drs_fr.json';
import es from '../i18n/drs_es.json';
import ja from '../i18n/drs_ja.json';
import ptBr from '../i18n/drs_pt_BR.json';

config.$inject = ['$compileProvider', '$locationProvider', '$translateProvider', '$translateMessageFormatInterpolationProvider', 'localStorageServiceProvider'];

function config($compileProvider, $locationProvider, $translateProvider, $translateMessageFormatInterpolationProvider, localStorageServiceProvider) {
  // TODO: remove this depenency by fixing component bindings https://github.com/angular/angular.js/blob/master/CHANGELOG.md#breaking-changes-1
  $compileProvider.preAssignBindingsEnabled(true);
  // Allow chrome-extension: URLs in ng-src
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|chrome-extension):|data:image\/)/);

  $locationProvider.hashPrefix('');

  // See https://angular-translate.github.io/docs/#/guide
  $translateProvider.useSanitizeValueStrategy('escape');
  $translateProvider.useMessageFormatInterpolation();
  $translateProvider.preferredLanguage('en');

  $translateMessageFormatInterpolationProvider.messageFormatConfigurer(function(mf) {
    mf.setIntlSupport(true);
  });

  $translateProvider
    .translations('en', en)
    .translations('it', it)
    .translations('de', de)
    .translations('fr', fr)
    .translations('es', es)
    .translations('ja', ja)
    .translations('pt-br', ptBr)
    .fallbackLanguage('en');

  localStorageServiceProvider.setPrefix('drs');
}

export default config;