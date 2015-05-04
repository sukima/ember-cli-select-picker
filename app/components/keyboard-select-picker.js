import Ember from 'ember';
import SelectPicker from './select-picker';
import KeyboardShortcutsMixin from 'ember-keyboard-shortcuts/mixins/component';

var KeyboardSelectPickerComponent = SelectPicker.extend(
  KeyboardShortcutsMixin, {

  layoutName: 'components/select-picker',

  nativeMobile: true,

  activeCursor: null,

  classNames: ['select-picker', 'keyboard-select-picker'],

  groupedContentList: Ember.computed(
    'groupedContentListWithoutActive', 'activeIndex',
    function() {
      var activeIndex = this.get('activeIndex');
      var result = Ember.A(this.get('groupedContentListWithoutActive'));
      result.forEach(function(item, index) {
        item.set('active', index === activeIndex);
      });
      return result;
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

  keyboardShortcuts: {
    'enter': function() {
      this.send('selectItem', this.get('activeItem'));
      return false;
    },
    'up': 'activePrev',
    'down': 'activeNext',
    'shift+tab': 'activePrev',
    'tab': 'activeNext',
    'esc': 'closeDropdown'
  },

  actions: {
    activeNext: function() {
      if (Ember.isNone(this.get('activeCursor'))) {
        this.set('activeCursor', 0);
      } else {
        this.incrementProperty('activeCursor');
      }
    },
    activePrev: function() {
      if (Ember.isNone(this.get('activeCursor'))) {
        this.set('activeCursor', -1);
      } else {
        this.decrementProperty('activeCursor');
      }
    }
  }
});

export default KeyboardSelectPickerComponent;
