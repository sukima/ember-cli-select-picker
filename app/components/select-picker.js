import Ember from 'ember';
import SelectPickerMixin from 'ember-cli-select-picker/mixins/select-picker';

var I18nProps = (Ember.I18n && Ember.I18n.TranslateableProperties) || {};

export default Ember.Component.extend(
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
      const enabled = this.get('badgeEnabled');
      const selected = this.get('selection.length');
      return (enabled && selected && selected !== 0) ? selected : '';
    }
  ),

  setupDom: Ember.on('didInsertElement', function() {
    const id = this.get('elementId');
    this.updateDropUp();
    $(document)
      .on(`click.${id}`,  Ember.run.bind(this, this.hideDropdownMenu))
      .on(`scroll.${id}`, Ember.run.bind(this, this.updateDropUp))
      .on(`resize.${id}`, Ember.run.bind(this, this.updateDropUp));
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

  updateDropUp() {
    const windowHeight   = $(window).height();
    const scrollTop      = $(window).scrollTop();
    const buttonOffset   = this.$().offset().top;
    const buttonHeight   = this.$().height();
    const menuHeight     = this.$('.dropdown-menu').height();
    const viewportOffset = buttonOffset - scrollTop;
    const menuBottom     = viewportOffset + buttonHeight + menuHeight;
    this.set('isDropUp', menuBottom > windowHeight);
  },

  teardownDom: Ember.on('willDestroyElement', function() {
    $(document).off(`.${this.get('elementId')}`);
  }),

  actions: {
    showHide() {
      this.toggleProperty('showDropdown');
    },

    openDropdown() {
      this.set('showDropdown', true);
    },

    closeDropdown() {
      this.set('showDropdown', false);
    }
  }
});
