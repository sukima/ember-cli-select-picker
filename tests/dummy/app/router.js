import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

// Ember 1.10 does not support `export default Router.map(function() {…})`
Router.map(function() {
  this.route('test-select-picker');
  this.route('test-list-picker');
});

export default Router;
