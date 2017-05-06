require('babel-polyfill');

require('./scripts/google');

window.MessageFormat = require('messageformat');

// Initialize the main DRS app
require('./scripts/app.module');

require('./scripts/drsBungieLookup.service.js');
require('./scripts/drsConstants');
require('./scripts/drsFooter.directive.js');
require('./scripts/drsPlayerList.directive.js');
require('./scripts/drsPlayerList.service.js');
require('./scripts/drsHeader.directive.js');
require('./scripts/drsInputPlayer.directive.js');
require('./scripts/drsQueue.service.js');
require('./scripts/drsSettings.controller.js');
require('./scripts/drsSettings.service.js');
require('./scripts/drsUtilities.service.js');

require('./scss/main.scss');