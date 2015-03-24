import Ember from 'ember';
import SelectPickerMixin from '../mixins/select-picker';

var I18nProps = (Ember.I18n && Ember.I18n.TranslateableProperties) || {};

var SelectPickerComponent = Ember.Component.extend(
  SelectPickerMixin, I18nProps, {

  classNames: ['select-picker'],

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
