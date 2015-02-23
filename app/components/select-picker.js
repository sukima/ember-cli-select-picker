import Ember from 'ember';

// Features:
//   - select all/none
//
// TODO: features:
//   - Keyboard support
//   - Ember.I18n support

var SelectPickerComponent = Ember.Component.extend({
  classNames: ['select-picker'],
  showDropdown: false,

  didInsertElement: function() {
    $(document).on('click', function (e) {
      if (this.get('keepDropdownOpen')) {
        this.set('keepDropdownOpen', false);
        return;
      }
      if (!$.contains(this.element, e.target)) {
        this.set('showDropdown', false);
      }
    }.bind(this));
  },

  menuButtonId: function() {
    return this.get('elementId') + '-dropdown-menu';
  }.property('elementId'),

  selectionAsArray: function() {
    var selection = this.get('selection');
    if (Ember.isArray(selection)) {
      return selection;
    } else if (Ember.isNone(selection)) {
      return [];
    } else {
      return [selection];
    }
  },

  contentPathName: function(pathName) {
    return this.getWithDefault(pathName, '').substr(8);
  },

  getByContentPath: function(obj, pathName) {
    return Ember.get(obj, this.contentPathName(pathName));
  },

  contentList: function() {
    var lastGroup;
    // Ember.Select does not include the content prefix for optionGroupPath
    var groupPath = this.get('optionGroupPath');
    // Ember.Select expects optionLabelPath and optionValuePath to have a
    // `content.` prefix
    var labelPath = this.contentPathName('optionLabelPath');
    var valuePath = this.contentPathName('optionValuePath');
    // selection is either an object or an array of object depending on the
    // value of the multiple property. Ember.Select maintains the value
    // property.
    var selection = this.selectionAsArray();
    var searchFilter = this.getWithDefault('searchFilter', '').toLowerCase();
    var result = this.get('content')
      .map(function(item) {
        var label = Ember.get(item, labelPath);
        var value = Ember.get(item, valuePath);
        var group = groupPath ? Ember.get(item, groupPath) : null;
        if (group === lastGroup) {
          group = null;
        } else {
          lastGroup = group;
        }
        return {
          item:     item,
          group:    group,
          label:    label,
          value:    value,
          selected: selection.contains(item)
        };
      })
      .filter(function (item) {
        var inGroup, inLabel;
        if (Ember.isEmpty(searchFilter)) {
          return true; // Show all
        }
        if (item.group) {
          inGroup = item.group.toLowerCase().indexOf(searchFilter) >= 0;
        }
        if (item.label) {
          inLabel = item.label.toLowerCase().indexOf(searchFilter) >= 0;
        }
        return (inGroup || inLabel);
      });
    if (result[0]) {
      result[0].first = true;
    }
    return result;
  }.property('selection.@each', 'content.@each', 'optionGroupPath', 'optionLabelPath', 'optionValuePath', "searchFilter"),

  selectionSummary: function() {
    var selection = this.selectionAsArray();
    switch (selection.length) {
      case 0:  return this.get('prompt') || '';
      case 1:  return this.getByContentPath(selection[0], 'optionValuePath');
      default: return selection.length + ' items selected';
    }
  }.property('selection.@each'),

  toggleSelection: function(value) {
    var selection = this.get('selection');
    if (selection.contains(value)) {
      selection.removeObject(value);
    } else {
      selection.pushObject(value);
    }
  },

  actions: {
    selectItem: function(selected) {
      this.set('keepDropdownOpen', true);
      if (!this.get('disabled')) {
        if (this.get('multiple')) {
          this.toggleSelection(selected.item);
        } else {
          this.set('selection', selected.item);
        }
      }
      return true;
    },

    showHide: function () {
      this.toggleProperty('showDropdown');
    }
  }

});

export default SelectPickerComponent;
