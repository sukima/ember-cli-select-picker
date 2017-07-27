import Ember from 'ember';

export default Ember.Mixin.create({
  activeCursor: null,
  previousActiveIndex: 0,

  updateActiveItem: Ember.observer(
    'activeCursor', 'contentList.length',
    function() {
      const previousActiveIndex = this.get('previousActiveIndex');
      const activeIndex = this.get('activeIndex');
      if (Ember.typeOf(activeIndex) !== 'number') { return; }
      this.set(`contentList.${previousActiveIndex}.active`, false);
      this.set(`contentList.${activeIndex}.active`, true);
      this.set('previousActiveIndex', activeIndex);
    }
  ),

  activeIndex: Ember.computed(
    'activeCursor', 'contentList.length',
    function() {
      var cursor = this.get('activeCursor');
      if (Ember.isNone(cursor)) {
        return null;
      }
      var len = this.get('contentList.length');
      return (cursor % len + len) % len;
    }
  ),

  activeItem: Ember.computed(
    'activeIndex', 'contentList.[]',
    function() {
      return this.get('contentList').objectAt(this.get('activeIndex'));
    }
  ),

  actions: {
    activeNext() {
      if (Ember.isNone(this.get('activeCursor'))) {
        this.set('activeCursor', 0);
      } else {
        this.incrementProperty('activeCursor');
      }
    },

    activePrev() {
      if (Ember.isNone(this.get('activeCursor'))) {
        this.set('activeCursor', -1);
      } else {
        this.decrementProperty('activeCursor');
      }
    },

    selectActiveItem() {
      var item = this.get('activeItem');
      if (Ember.isPresent(item)) {
        this.send('selectItem', item);
      }
    },
  }
});
