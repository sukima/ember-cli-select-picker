import SelectPicker from './select-picker';
import ItemCursorMixin from 'ember-cli-select-picker/mixins/item-cursor';
import KeyboardShortcutsMixin from 'ember-keyboard-shortcuts/mixins/component';

function makeKeyboardAction(action) {
  return function() {
    if (!this.get('showDropdown')) {
      // ignore keyboard input on components that are not *in focus*
      return true;
    }
    this.sendAction(action, arguments);
    return false;
  };
}

export default SelectPicker.extend(ItemCursorMixin, KeyboardShortcutsMixin, {
  layoutName: 'components/select-picker',
  classNames: ['select-picker', 'keyboard-select-picker'],

  keyboardShortcuts: {
    'enter': {
      action: makeKeyboardAction('selectActiveItem'),
      scoped: true,
    },
    'up': {
      action: makeKeyboardAction('activePrev'),
      scoped: true,
    },
    'down': {
      action: makeKeyboardAction('activeNext'),
      scoped: true,
    },
    'shift+tab': {
      action: makeKeyboardAction('activePrev'),
      scoped: true,
    },
    'tab': {
      action: makeKeyboardAction('activeNext'),
      scoped: true,
    },
    'esc': {
      action: makeKeyboardAction('closeDropdown'),
      scoped: true,
    },
  }
});
