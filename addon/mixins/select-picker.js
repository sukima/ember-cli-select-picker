import Ember from 'ember';

const selectOneOf = function(someSelected,
                           allSelected,
                           noneSelected) {
  return Ember.computed(
    'hasSelectedItems', 'allItemsSelected',
    function() {
      if (this.get('allItemsSelected')) {
        return allSelected.call(this);
      } else if (this.get('hasSelectedItems')) {
        return someSelected.call(this);
      } else {
        return noneSelected.call(this);
      }
    }
  );
};

const selectOneOfValue = function(someSelectedValue,
                                allSelectedValue,
                                noneSelectedValue) {
  return selectOneOf(
    function() { return someSelectedValue; },
    function() { return allSelectedValue; },
    function() { return noneSelectedValue; }
  );
};

const selectOneOfProperty = function(someSelectedKey,
                                   allSelectedKey,
                                   noneSelectedKey) {
  return selectOneOf(
    function() { return this.get(someSelectedKey); },
    function() { return this.get(allSelectedKey); },
    function() { return this.get(noneSelectedKey); }
  );
};

const isAdvancedSearch = function(liveSearch) {
  return (
    Ember.typeOf(liveSearch) === 'string' &&
    liveSearch.toLowerCase() === 'advanced'
  );
};

const SelectPickerMixin = Ember.Mixin.create({
  liveSearch:   false,
  showDropdown: false,
  promptMessage: 'Please select an option',
  prompt: Ember.computed.bool('promptMessage'),

  showNativePrompt: Ember.computed(
    'multiple', 'prompt',
    function() {
      return !this.get('multiple') && Ember.isPresent(this.get('prompt'));
    }
  ),

  menuButtonId: Ember.computed(
    'elementId',
    function() {
      return this.get('elementId') + '-dropdown-menu';
    }
  ),

  selectionAsArray: function() {
    return Ember.makeArray(this.get('selection'));
  },

  contentList: Ember.computed(
    'selection.[]', 'content.[]', 'optionGroupPath',
    'optionLabelPath', 'optionValuePath', 'searchFilter',
    function() {
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

      var result = Ember.A(this.get('content'))
        .map(function(item) {
          const label = Ember.get(item, labelPath);
          const value = Ember.get(item, valuePath);
          const group = groupPath ? Ember.get(item, groupPath) : null;
          if (searchMatcher(group) || searchMatcher(label)) {
            return Ember.Object.create({
              item:     item,
              group:    group,
              label:    label,
              value:    value,
              selected: selection.contains(item)
            });
          } else {
            return null;
          }
        });

      // Ember Addons need to be coded as if Ember.EXTEND_PROTOTYPES = false
      // Because of this we need to manually extend our native array from the
      // above map() function. Even though compact() is an Ember function it
      // too sufferes from the same fate.
      result = Ember.A(Ember.A(result).compact());

      if (!Ember.isEmpty(result)) {
        result.get('firstObject').set('first', true);
      }

      return result;
    }
  ),

  nestedGroupContentList: Ember.computed(
    'contentList.[].group',
    function() {
      const contentList = Ember.A(this.get('contentList'));
      const groups = contentList.mapBy('group').uniq();
      const results = Ember.A();
      groups.forEach(function(group) {
        results.pushObject(Ember.Object.create({
          name: group,
          items: contentList.filterBy('group', group)
        }));
      });
      return results;
    }
  ),

  groupedContentListWithoutActive: Ember.computed(
    'contentList.[].group',
    function() {
      var lastGroup;
      var result = Ember.A(this.get('contentList'));
      result.forEach(function(item) {
        let group = item.get('group');
        if (group === lastGroup) {
          item.set('group', null);
        } else {
          lastGroup = group;
        }
      });
      return result;
    }
  ),

  groupedContentList: Ember.computed.alias('groupedContentListWithoutActive'),

  contentPathName: function(pathName) {
    return this.getWithDefault(pathName, '').substr(8);
  },

  getByContentPath: function(obj, pathName) {
    return Ember.get(obj, this.contentPathName(pathName));
  },

  selectedContentList:   Ember.computed.filterBy('contentList', 'selected'),
  unselectedContentList: Ember.computed.setDiff('contentList', 'selectedContentList'),
  hasSelectedItems:      Ember.computed.gt('selection.length', 0),
  allItemsSelected: Ember.computed(
    'selection.length', 'content.length',
    function() {
      return Ember.isEqual(this.get('selection.length'), this.get('content.length'));
    }
  ),

  glyphiconClass:     selectOneOfValue('glyphicon-minus', 'glyphicon-ok', ''),
  selectAllNoneLabel: selectOneOfProperty('selectNoneLabel', 'selectNoneLabel', 'selectAllLabel'),

  makeSearchMatcher: function () {
    var searchFilter = this.get('searchFilter');
    // item can be null, string, or SafeString.
    // SafeString does not have toLowerCase() so use toString() to
    // normalize it.
    if (Ember.isEmpty(searchFilter)) {
      return function () {
        return true; // Show all
      };
    } else if (isAdvancedSearch(this.get('liveSearch'))) {
      searchFilter = new RegExp(searchFilter.split('').join('.*'), 'i');
      return function (item) {
        if (Ember.isNone(item)) {
          return false;
        } else {
          return searchFilter.test(item.toString());
        }
      };
    } else {
      searchFilter = searchFilter.toLowerCase();
      return function (item) {
        if (Ember.isNone(item)) {
          return false;
        } else {
          return item.toString().toLowerCase().indexOf(searchFilter) >= 0;
        }
      };
    }
  },

  selectionLabels: Ember.computed.mapBy('selectedContentList', 'label'),

  selectionSummary: Ember.computed(
    'selectionLabels.[]', 'nothingSelectedMessage', 'summaryMessage', 'summaryMessageKey',
    function() {
      var selection = this.get('selectionLabels');
      var count = selection.get('length');
      var messageKey = this.get('summaryMessageKey');
      if (Ember.I18n && Ember.isPresent(messageKey)) {
        // TODO: Allow an enablePrompt="false" feature
        if (count === 0) {
          return this.get('nothingSelectedMessage');
        }
        var item = selection.get('firstObject');
        var translation = Ember.I18n.t(messageKey, {
          count: count,
          item: item,
          list: selection.join(', ')
        });
        // If the item we're inserting into our selection message was a
        // SafeString then then translation needs to be marked as well in order
        // for any html in the original not to get escaped.
        if (item && item.toHTML) {
          translation = Ember.String.htmlSafe(translation);
        }
        return translation;
      }
      switch (count) {
        case 0:
          return this.get('nothingSelectedMessage');
        case 1:
          return selection.get('firstObject');
        default:
          return Ember.String.fmt(
            this.get('summaryMessage'),
            count,
            selection.get('firstObject'),
            selection.join(', ')
          );
      }
    }
  ),

  clearSearchDisabled: Ember.computed.empty('searchFilter'),

  toggleSelection: function(value) {
    var selection = this.get('selection');
    if (Ember.isNone(selection)) {
      selection = Ember.A();
      this.set('selection', selection);
    }
    if (selection.contains(value)) {
      selection.removeObject(value);
    } else {
      selection.pushObject(value);
    }
  },

  actions: {
    selectItem(selected) {
      if (!this.get('disabled')) {
        if (this.get('multiple')) {
          this.set('keepDropdownOpen', true);
          this.toggleSelection(selected.get('item'));
        } else {
          this.setProperties({
            value: selected.get('value'),
            selection: selected.get('item')
          });
        }
      }
      return false;
    },

    selectAllNone(listName) {
      var _this = this;
      this.get(listName)
        .forEach(function (item) {
          _this.send('selectItem', item);
        });
      return false;
    },

    selectByValue() {
      const hasPrompt = Ember.isPresent(this.get('prompt'));
      const contentList = this.get('contentList');
      const selectedValues = Ember.makeArray(this.$('select').val());
      if (this.get('multiple')) {
        console.dir(selectedValues);
        this.set('selection', contentList.filter(function(item) {
          return selectedValues.indexOf(item.get('value')) !== -1;
        }));
      } else if (hasPrompt && Ember.isEmpty(selectedValues[0])) {
        this.setProperties({value: null, selection: null});
      } else {
        this.send('selectItem', contentList.findBy('value', selectedValues[0]));
      }
    },

    toggleSelectAllNone() {
      var listName;
      if (this.get('hasSelectedItems')) {
        listName = 'selectedContentList';
      } else {
        listName = 'unselectedContentList';
      }
      this.send('selectAllNone', listName);
      return false;
    },

    clearFilter() {
      this.set('searchFilter', null);
      return false;
    }
  }
});

export default SelectPickerMixin;
