// Load in dependencies
var Settings = require('shallow-settings');

// Define our settings
module.exports = new Settings({
  common: {
    inDevelopment: true,
    inProduction: false,
    'app.locals': Settings.lazy(function () {
      return {
        env: this.ENV,
        config: {
          author: 'Todd Wolfson',
          title: 'Todd Wolfson - Javascript Developer',
          url: 'http://twolfson.com/'
        }
      };
    }),
    mail: Settings.lazy(function () {
      return require('./mail');
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
    inDevelopment: false,
    inProduction: true,
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
