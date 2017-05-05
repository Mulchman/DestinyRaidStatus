require('babel-polyfill');

require('./scripts/google');

// Initialize the main DRS app
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
require('./scripts/drsSettings.service.js');
require('./scripts/drsUtilities.service.js');

require('./scss/main.scss');