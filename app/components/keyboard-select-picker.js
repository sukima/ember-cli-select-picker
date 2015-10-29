import Ember from 'ember';
import SelectPicker from './select-picker';
import ItemCursorMixin from 'ember-cli-select-picker/mixins/item-cursor';

const KEY_ENTER = 13;
const KEY_ESC   = 27;
const KEY_UP    = 38;
const KEY_DOWN  = 40;

export default SelectPicker.extend(ItemCursorMixin, {
  layoutName: 'components/select-picker',
  classNames: ['select-picker', 'keyboard-select-picker'],

  didInsertElement() {
    this.$().on(`keydown.${this.get('elementId')}`,
                Ember.run.bind(this, 'handleKeyPress'));
  },

  willDestroyElement() {
    this.$().off(`keydown.${this.get('elementId')}`);
  },

  focusActiveItem() {
    this.$(`[data-itemid=${this.get('activeItem.itemId')}]`).focus();
  },

  handleKeyPress(e) {
    var actionName = (() => {
      switch (e.which) {
        case KEY_DOWN: return 'activeNext';
        case KEY_UP:   return 'activePrev';
        case KEY_ESC:  return 'closeDropdown';
        case KEY_ENTER:
          return this.get('showDropdown') ?
            'selectActiveItem' :
            'openDropdown';
        default: return null;
      }
    })();

    if (actionName) {
      e.preventDefault();
      Ember.run(() => { this.send(actionName); });
      this.focusActiveItem();
      return false;
    }

    return true;
  }
});
