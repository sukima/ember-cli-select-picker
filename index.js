/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-select-picker',
  included: function(app) {
    this._super.included(app);
    app.import('vendor/select-picker.css');
  }
};
