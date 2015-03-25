import Ember from 'ember';

// TODO: features:
//   - Keyboard support

var selectOneOf = function(someSelected,
                           allSelected,
                           noneSelected) {
  return function() {
    if (this.get('allItemsSelected')) {
      return allSelected.call(this);
    } else if (this.get('hasSelectedItems')) {
      return someSelected.call(this);
    } else {
      return noneSelected.call(this);
    }
  }.property('hasSelectedItems', 'allItemsSelected');
};

var selectOneOfValue = function(someSelectedValue,
                                allSelectedValue,
                                noneSelectedValue) {
  return selectOneOf(
    function() { return someSelectedValue; },
    function() { return allSelectedValue; },
    function() { return noneSelectedValue; }
  );
};

var selectOneOfProperty = function(someSelectedKey,
                                   allSelectedKey,
                                   noneSelectedKey) {
  return selectOneOf(
    function() { return this.get(someSelectedKey); },
    function() { return this.get(allSelectedKey); },
    function() { return this.get(noneSelectedKey); }
  );
};

var SelectPickerMixin = Ember.Mixin.create({
  liveSearch:      false,
  showDropdown:    false,
  prompt:          false,
  summaryMessage:  '%@ items selected',

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

  contentList: function() {
    // Ember.Select does not include the content prefix for optionGroupPath
    var groupPath = this.get('optionGroupPath');
    // Ember.Select expects optionLabelPath and optionValuePath to have a
    // `content.` prefix
    var labelPath = this.contentPathName('optionLabelPath');
    var valuePath = this.contentPathName('optionValuePath');
    // selection is either an object or an array of object depending on the
    // value of the multiple property. Ember.Select maintains the value
    // property.
    var selection     = this.selectionAsArray();
    var searchMatcher = this.makeSearchMatcher();

    var result = this.get('content')
      .map(function(item) {
        var label = Ember.get(item, labelPath);
        var value = Ember.get(item, valuePath);
        var group = groupPath ? Ember.get(item, groupPath) : null;
        if (searchMatcher(group) || searchMatcher(label)) {
          return {
            item:     item,
            group:    group,
            label:    label,
            value:    value,
            selected: selection.contains(item)
          };
        } else {
          return null;
        }
      })
      .compact();

    if (result[0]) {
      result[0].first = true;
    }

    return result;
  }.property('selection.@each', 'content.@each', 'optionGroupPath',
             'optionLabelPath', 'optionValuePath', 'searchFilter'),

  contentPathName: function(pathName) {
    return this.getWithDefault(pathName, '').substr(8);
  },

  getByContentPath: function(obj, pathName) {
    return Ember.get(obj, this.contentPathName(pathName));
  },

  selectedContentList:   Ember.computed.filterBy('contentList', 'selected'),
  unselectedContentList: Ember.computed.setDiff('contentList', 'selectedContentList'),
  hasSelectedItems:      Ember.computed.gt('selection.length', 0),
  allItemsSelected: function() {
    return Ember.isEqual(this.get('selection.length'), this.get('content.length'));
  }.property('selection.length', 'content.length'),

  glyphiconClass:     selectOneOfValue('glyphicon-minus', 'glyphicon-ok', ''),
  selectAllNoneLabel: selectOneOfProperty('selectNoneLabel', 'selectNoneLabel', 'selectAllLabel'),

  makeSearchMatcher: function () {
    var searchFilter = this.get('searchFilter');
    if (Ember.isEmpty(searchFilter)) {
      return function () {
        return true; // Show all
      };
    } else if (this.get('liveSearch').toLowerCase() === 'advanced') {
      searchFilter = new RegExp(searchFilter.split('').join('.*'), 'i');
      return function (item) {
        return item && searchFilter.test(item);
      };
    } else {
      return function (item) {
        return item && item.toLowerCase().indexOf(searchFilter.toLowerCase()) >= 0;
      };
    }
  },

  selectionSummary: function() {
    var selection = this.selectionAsArray();
    switch (selection.length) {
      // I18n done by promptTranslate property (I18n plugin)
      case 0:  return this.get('prompt') || 'Nothing Selected';
      case 1:  return this.getByContentPath(selection[0], 'optionLabelPath');
      default:
        if (Ember.I18n) {
          return Ember.I18n.t(this.get('summaryMessage'), {count: selection.length});
        } else {
          return this.get('summaryMessage').fmt(selection.length);
        }
    }
  }.property('selection.@each'),

  clearSearchDisabled: Ember.computed.empty('searchFilter'),

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

    selectAllNone: function (listName) {
      this.get(listName)
        .forEach(function (item) {
          this.send('selectItem', item);
        }.bind(this));
    },

    toggleSelectAllNone: function () {
      var listName;
      if (this.get('hasSelectedItems')) {
        listName = 'selectedContentList';
      } else {
        listName = 'unselectedContentList';
      }
      this.send('selectAllNone', listName);
    },

    clearFilter: function() {
      this.set('searchFilter', null);
    }
  }
});

export default SelectPickerMixin;
