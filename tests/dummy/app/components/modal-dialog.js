import Ember from 'ember';

export default Ember.Component.extend({
  isVisible: false,
  showHide: Ember.observer('isVisible', function() {
    this.$('.modal').css({display: (this.get('isVisible') ? 'block' : 'none')});
  })
});
