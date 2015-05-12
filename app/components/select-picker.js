import Ember from 'ember';
import SelectPickerMixin from 'ember-cli-select-picker/mixins/select-picker';

var I18nProps = (Ember.I18n && Ember.I18n.TranslateableProperties) || {};

var SelectPickerComponent = Ember.Component.extend(
  SelectPickerMixin, I18nProps, {

  nothingSelectedMessage: 'Nothing Selected',
  summaryMessage:         '%@ items selected',
  selectAllLabel:         'All',
  selectNoneLabel:        'None',

  nativeMobile: true,

  classNames: ['select-picker', 'btn-group'],
  buttonClass: 'btn-default',

  badgeEnabled: Ember.computed.and('showBadge', 'multiple'),

  selectionBadge: Ember.computed(
    'selection.length', 'badgeEnabled',
    function() {
      var enabled = this.get('badgeEnabled');
      var selected = this.get('selection.length');
      return (enabled && selected && selected !== 0) ? selected : '';
    }
  ),

  setupDom: Ember.on('didInsertElement', function() {
    $(document).on(
      `click.${this.get('elementId')}`,
      Ember.run.bind(this, this.hideDropdownMenu)
    );
  }),

  hideDropdownMenu: function(evt) {
    if (this.get('keepDropdownOpen')) {
      this.set('keepDropdownOpen', false);
      return;
    }
    if (this.element && !$.contains(this.element, evt.target)) {
      this.send('closeDropdown');
    }
  },

  teardownDom: Ember.on('willDestroyElement', function() {
    $(document).off(`.${this.get('elementId')}`);
  }),

  actions: {
    showHide: function () {
      this.toggleProperty('showDropdown');
    },
    closeDropdown: function() {
      this.set('showDropdown', false);
    }
  }
});

export default SelectPickerComponent;
