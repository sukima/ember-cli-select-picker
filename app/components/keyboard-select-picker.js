import Ember from 'ember';
import SelectPicker from './select-picker';
import KeyboardShortcutsMixin from 'ember-keyboard-shortcuts/mixins/component';

function makeKeyboardAction(fn) {
  return function() {
    if (!this.get('showDropdown')) {
      // ignore keyboard input on components that are not *in focus*
      return true;
    }
    fn.apply(this, arguments);
    return false;
  };
}

var KeyboardSelectPickerComponent = SelectPicker.extend(
  KeyboardShortcutsMixin, {

  layoutName: 'components/select-picker',

  nativeMobile: true,

  activeCursor: null,

  classNames: ['select-picker', 'keyboard-select-picker'],

  previousActiveIndex: 0,

  updateActiveItem: Ember.observer(
    'activeCursor', 'contentList.length',
    function() {
      const previousActiveIndex = this.get('previousActiveIndex');
      const activeIndex = this.get('activeIndex');
      if (Ember.typeOf(activeIndex) !== 'number') { return; }
      Ember.changeProperties(() => {
        this.set(`contentList.${previousActiveIndex}.active`, false);
        this.set(`contentList.${activeIndex}.active`, true);
        this.set('previousActiveIndex', activeIndex);
      });
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
    'enter': {
      action: 'selectActiveItem',
      scoped: true,
    },
    'up': {
      action: 'activePrev',
      scoped: true,
    },
    'down': {
      action: 'activeNext',
      scoped: true,
    },
    'shift+tab': {
      action: 'activePrev',
      scoped: true,
    },
    'tab': {
      action: 'activeNext',
      scoped: true,
    },
    'esc': {
      action: 'closeDropdown'
      scoped: true,
    },
  },

  actions: {
    activeNext: makeKeyboardAction(function() {
      if (Ember.isNone(this.get('activeCursor'))) {
        this.set('activeCursor', 0);
      } else {
        this.incrementProperty('activeCursor');
      }
    }),

    activePrev: makeKeyboardAction(function() {
      if (Ember.isNone(this.get('activeCursor'))) {
        this.set('activeCursor', -1);
      } else {
        this.decrementProperty('activeCursor');
      }
    }),

    selectActiveItem: makeKeyboardAction(function() {
      var item = this.get('activeItem');
      if (Ember.isPresent(item)) {
        this.send('selectItem', item);
      }
    }),
  }
});

export default KeyboardSelectPickerComponent;
