require('babel-polyfill');

// TODO: remove this globals and instead require where needed
window.$ = window.jQuery = require('jquery');
require('jquery-textcomplete');
require('jquery-ui/ui/position');
window.MessageFormat = require('messageformat');

// Initialize the main DIM app
require('./scripts/app.module');

require('./scripts/drsBungieLookup.service.js');
require('./scripts/drsFooter.directive.js');
require('./scripts/drsGamertagList.directive.js');
require('./scripts/drsGamertagList.service.js');
require('./scripts/drsHeader.directive.js');
require('./scripts/drsInputGamertag.directive.js');
require('./scripts/drsPlatform.service.js');
require('./scripts/drsQueue.service.js');
require('./scripts/drsRaid.service.js');
require('./scripts/drsUtilities.service.js');

require('./scss/main.scss');