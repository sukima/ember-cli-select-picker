/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-select-picker',
  included: function(app) {
    app.import('vendor/select-picker.css');
  }
};
