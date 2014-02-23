// Load in dependencies
var numscale = require('numscale');
var Settings = require('shallow-settings');
var errorLoggers = require('./error-loggers');

// Define our settings
module.exports = new Settings({
  common: {
    addDevelopmentRoutes: true,
    addTestRoutes: true,
    articles: Settings.lazy(function () {
      return require('../articles');
    }),
    'app.locals': Settings.lazy(function () {
      // TODO: This is very bad technique but models/projects is worse
      var projects = require('../server/models/projects');
      if (this.updateProjectsImmediately) {
        process.nextTick(global.updateProjects);
      }
      return {
        config: {
          author: 'Todd Wolfson',
          title: 'Todd Wolfson - Javascript Developer',
          url: 'http://twolfson.com/'
        },
        env: this.ENV,
        numscale: numscale.scale,
        projects: projects
      };
    }),
    // TODO: Restore common logger
    // errorLogger: Settings.lazy(function () {
    //   return errorLoggers.common();
    // }),
    errorLogger: Settings.lazy(function () {
      return errorLoggers.production({
        environment: this.ENV,
        revision: this['package'].version
      });
    }),
    mail: Settings.lazy(function () {
      return require('./mail');
    }),
    'package': Settings.lazy(function () {
      return require('../package.json');
    }),
    'support-me': {
      bitcoin: '1LVT8UpsgyKhGzN3TZxSKqqqd466NtZ99p',
      dogecoin: 'DGJQbYtSH8jau967XKUR7cpZ7jJEe9SPSQ',
      flattr: 'twolfsn',
      gittip: 'twolfson',
      paypal: {
        name: 'Todd Wolfson',
        email: 'todd@twolfson.com'
      },
    },
    updateProjectsImmediately: false,
    url: {
      internal: {
        protocol: 'http',
        hostname: 'localhost',
        port: 8080
      },
      external: {
        protocol: 'http',
        hostname: 'localhost',
        port: 8080
      }
    }
  },
  development: {
    // Same as common
  },
  test: {
    addDevelopmentRoutes: false,
    addTestRoutes: true,
    mail: {
      host: 'localhost',
      port: 1338
    },
    url: {
      internal: {
        protocol: 'http',
        hostname: 'localhost',
        port: 1337
      },
      external: {
        protocol: 'http',
        hostname: 'twolfson.test',
        port: 1337
      }
    }
  },
  production: {
    addDevelopmentRoutes: false,
    addTestRoutes: false,
    errorLogger: Settings.lazy(function () {
      return errorLoggers.production({
        environment: this.ENV,
        revision: this['package'].version
      });
    }),
    updateProjectsImmediately: true,
    url: {
      internal: {
        protocol: 'http',
        hostname: 'localhost',
        port: 8080
      },
      external: {
        protocol: 'http',
        hostname: 'twolfson.com'
      }
    }
  }
});
