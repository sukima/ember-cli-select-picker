import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('test-select-picker');
  this.route('test-list-picker');
  this.route('test-keyboard-picker');
});

export default Router;
