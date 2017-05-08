require('babel-polyfill');

require('./scripts/google');

window.MessageFormat = require('messageformat');

// Initialize the main DRS app
require('./scripts/app.module');

require('./scripts/drsBungieLookup.factory.js');
require('./scripts/drsConstants');
require('./scripts/drsFooter.directive.js');
require('./scripts/drsHeader.directive.js');
require('./scripts/drsInputPlayer.directive.js');
require('./scripts/drsMain.controller.js');
require('./scripts/drsPlayerList.directive.js');
require('./scripts/drsPlayerList.factory.js');
require('./scripts/drsQueue.factory.js');
require('./scripts/drsSettings.controller.js');
require('./scripts/drsSettings.factory.js');
require('./scripts/drsUtilities.factory.js');

// TODO: move to a separate module
require('./scripts/api/the100/drsThe100.controller.js');
require('./scripts/api/the100/drsThe100.factory.js');

require('./scss/main.scss');