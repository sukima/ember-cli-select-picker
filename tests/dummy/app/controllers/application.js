import Ember from 'ember';
import config from '../config/environment';

var ApplicationController = Ember.Controller.extend({
  addonVersion: config.APP.addonVersion
});

export default ApplicationController;
