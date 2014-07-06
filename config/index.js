// Load in dependencies
var _ = require('underscore');
var Settings = require('shallow-settings');
var numscale = require('numscale');
var errorLoggers = require('./error-loggers');
var pkg = require('../package.json');

// Union all of our settings
var config = {common: {}, development: {}, test: {}, production: {}};
[require('./error'), require('./generic'), require('./url')].forEach(function addConfig (_config) {
  // Assert that the new config has no repeated keys
  var oldKeys = _.union(_.keys(config.common), _.keys(config.development), _.keys(config.test), _.keys(config.production));
  var newKeys = _.union(_.keys(_config.common), _.keys(_config.development), _.keys(_config.test), _.keys(_config.production));
  var sameKeys = _.intersection(oldKeys, newKeys);
  if (sameKeys.length > 0) {
    throw new Error('Duplicate keys found in multiple configs. Expected none. Found: ' + JSON.stringify(sameKeys));
  }

  // Add on the new properties
  _.extend(config.common, _config.common);
  _.extend(config.development, _config.development);
  _.extend(config.test, _config.test);
  _.extend(config.production, _config.production);
});

// Define our settings
exports.getSettings = function (options) {
  // Load our settings
  var _settings = new Settings(config);
  var settings = _settings.getSettings(options);

  // Return our settings
  settings.articles = require('../articles');
  settings['app.locals'] = {
    config: {
      author: 'Todd Wolfson',
      title: 'Todd Wolfson - Javascript Developer',
      url: 'http://twolfson.com/'
    },
    env: settings.ENV,
    numscale: numscale.scale
  };
    // TODO: Bring me back via `errorLogger`
    // errorLogger: Settings.lazy(function () {
    //   return errorLoggers['console']();
    // }),
  // production: _.extend({}, urlConfig.production, {
    // TODO: Bring me back via `errorLogger`
    // errorLogger: Settings.lazy(function () {
    //   var rollbarConfig = require('./secret').rollbar;
    //   return errorLoggers.rollbar(rollbarConfig.serverToken, {
    //     environment: this.ENV,
    //     revision: pkg.version
    //   });
    // }),
  // })

    // TODO: Bring me back via `secret`
    // mail: Settings.lazy(function () {
    //   return require('./secret').mail;
    // }),
  settings['package'] = pkg;
  settings['support-me'] = {
    bitcoin: '1LVT8UpsgyKhGzN3TZxSKqqqd466NtZ99p',
    dogecoin: 'DGJQbYtSH8jau967XKUR7cpZ7jJEe9SPSQ',
    flattr: 'twolfsn',
    gittip: 'twolfson',
    paypal: {
      name: 'Todd Wolfson',
      email: 'todd@twolfson.com'
    }
  };
  return settings;
};
