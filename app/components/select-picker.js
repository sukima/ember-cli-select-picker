import Ember from 'ember';
import SelectPickerMixin from '../mixins/select-picker';

var I18nProps = (Ember.I18n && Ember.I18n.TranslateableProperties) || {};

var SelectPickerComponent = Ember.Component.extend(
  SelectPickerMixin, I18nProps, {

  selectAllLabel:  'All',
  selectNoneLabel: 'None',

  classNames: ['select-picker'],

  didInsertElement: function() {
    var eventName = 'click.' + this.get('elementId');
    $(document).on(eventName, function (e) {
      if (this.get('keepDropdownOpen')) {
        this.set('keepDropdownOpen', false);
        return;
      }
      if (this.element && !$.contains(this.element, e.target)) {
        this.set('showDropdown', false);
      }
    }.bind(this));
  },

  willDestroyElement: function() {
    $(document).off('.' + this.get('elementId'));
  },

  groupedContentList: function() {
    var lastGroup;
    return this.get('contentList').map(function(item) {
      var clonedItem = Ember.copy(item);
      if (clonedItem.group === lastGroup) {
        clonedItem.group = null;
      } else {
        lastGroup = clonedItem.group;
      }
      return clonedItem;
    });
  }.property('contentList.@each'),

  actions: {
    showHide: function () {
      this.toggleProperty('showDropdown');
    }
  }
});

export default SelectPickerComponent;
