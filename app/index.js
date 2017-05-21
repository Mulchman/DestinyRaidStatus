require('babel-polyfill');

require('./scripts/google');

window.MessageFormat = require('messageformat');

// Initialize the main DRS app
require('./scripts/app.module');

require('./scripts/services/drsBungieLookup.factory.js');
require('./scripts/services/drsInputMatcher.factory.js');
require('./scripts/services/drsPlayerList.factory.js');
require('./scripts/services/drsQueue.factory.js');
require('./scripts/services/drsSettings.factory.js');
require('./scripts/services/drsUtilities.factory.js');

require('./scss/main.scss');