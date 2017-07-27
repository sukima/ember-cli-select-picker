/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');
var Funnel = require('broccoli-funnel');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    sourcemaps: {
      enabled: false
    },
    fingerprint: {
      customHash: 'dist',
      exclude: ['screen-shot.png']
    },
    minifyCSS: {
      enabled: false
    },
    minifyJS: {
      enabled: false
    }
  });

  /*
    This build file specifes the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */
  app.import('bower_components/bootstrap/dist/css/bootstrap.css');
  app.import('bower_components/bootstrap/dist/js/bootstrap.js');

  app.import('bower_components/chance/chance.js');

  app.import('bower_components/highlightjs/styles/github.css');
  app.import('bower_components/highlightjs/highlight.pack.js');

  var fontTree = new Funnel(
    'bower_components/bootstrap/dist/fonts',
    {destDir: '/fonts'}
  );

  return app.toTree([fontTree]);
};
