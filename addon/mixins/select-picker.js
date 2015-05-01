import Ember from 'ember';

// TODO: features:
//   - Keyboard support

var selectOneOf = function(someSelected,
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

var isAdvancedSearch = function(liveSearch) {
  return (
    Ember.typeOf(liveSearch) === 'string' &&
    liveSearch.toLowerCase() === 'advanced'
  );
};

var SelectPickerMixin = Ember.Mixin.create({
  liveSearch:     false,
  showDropdown:   false,
  prompt:         false,
  content:        [],
  selection:      [],
  summaryMessage: '%@ items selected',

  menuButtonId: Ember.computed(
    'elementId',
    function() {
      return this.get('elementId') + '-dropdown-menu';
    }
  ),

  selectionAsArray: function() {
    var selection = this.get('selection');
    if (Ember.isNone(selection)) {
      return Ember.A();
    } else if (!Ember.isArray(selection)) {
      return Ember.A([selection]);
    }
    return Ember.A(selection);
  },

  contentList: Ember.computed(
    'selection.@each', 'content.@each', 'optionGroupPath', 'optionLabelPath',
    'optionValuePath', 'searchFilter',
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
          var label = Ember.get(item, labelPath);
          var value = Ember.get(item, valuePath);
          var group = groupPath ? Ember.get(item, groupPath) : null;
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

  groupedContentList: Ember.computed(
    'contentList.@each.group',
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
    if (Ember.isEmpty(searchFilter)) {
      return function () {
        return true; // Show all
      };
    } else if (isAdvancedSearch(this.get('liveSearch'))) {
      searchFilter = new RegExp(searchFilter.split('').join('.*'), 'i');
      return function (item) {
        return item && searchFilter.test(item);
      };
    } else {
      searchFilter = searchFilter.toLowerCase();
      return function (item) {
        return item && item.toLowerCase().indexOf(searchFilter) >= 0;
      };
    }
  },

  selectionSummary: Ember.computed(
    'selection.@each', 'prompt',
    function() {
      var selection = this.selectionAsArray();
      if (Ember.I18n) {
        return Ember.I18n.t(this.get('summaryMessage'), {count: selection.length});
      }
      switch (selection.length) {
        // I18n done by promptTranslate property (I18n plugin)
        case 0:
          return this.get('prompt') || 'Nothing Selected';
        case 1:
          return this.getByContentPath(selection.get('firstObject'), 'optionLabelPath');
        default:
          return Ember.String.fmt(this.get('summaryMessage'), selection.length);
      }
    }
  ),

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
      if (!this.get('disabled')) {
        if (this.get('multiple')) {
          this.set('keepDropdownOpen', true);
          this.toggleSelection(selected.item);
        } else {
          this.set('selection', selected.item);
        }
      }
      return true;
    },

    selectAllNone: function (listName) {
      var _this = this;
      this.get(listName)
        .forEach(function (item) {
          _this.send('selectItem', item);
        });
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
