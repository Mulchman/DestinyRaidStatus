import en from '../i18n/drs_en.json';
import it from '../i18n/drs_it.json';
import de from '../i18n/drs_de.json';
import fr from '../i18n/drs_fr.json';
import es from '../i18n/drs_es.json';
import ja from '../i18n/drs_ja.json';
import ptBr from '../i18n/drs_pt_BR.json';

function config($compileProvider, $locationProvider, $httpProvider, $translateProvider,
                $translateMessageFormatInterpolationProvider, localStorageServiceProvider, /* ngHttpRateLimiterConfigProvider */) {
  'ngInject';

  // Allow chrome-extension: URLs in ng-src
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*((https?|chrome-extension):|data:image\/)/);

  $locationProvider.hashPrefix('');
  $locationProvider.html5Mode(true);

  $httpProvider.interceptors.push('ngHttpRateLimiterInterceptor');
  $httpProvider.useApplyAsync(true);

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

  // ngHttpRateLimiterConfigProvider.addLimiter(/www\.bungie\.net\/d1\/Platform\/Destiny\/Stats/, 1, 1100);
}

export default config;