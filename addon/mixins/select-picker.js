import Ember from 'ember';

// Ember Addons need to be coded as if Ember.EXTEND_PROTOTYPES = false
// Because of this we need to make our own proxy functions to apply as one offs
// to native arrays.
const emberArrayFunc = function(method) {
  return function(ctx, ...args) {
    const props = Ember.Enumerable.mixins[0].properties;
    Ember.assert(
      `Ember.Enumerable has no method ${method}`,
      Ember.typeOf(props[method]) === 'function'
    );
    const result = props[method].apply(Ember.A(ctx), args);
    if (Ember.typeOf(result) === 'array') {
      return Ember.A(result);
    } else {
      return result;
    }
  };
};
const _contains = emberArrayFunc('contains');
const _mapBy    = emberArrayFunc('mapBy');
const _filterBy = emberArrayFunc('filterBy');
const _findBy   = emberArrayFunc('findBy');
const _uniq     = emberArrayFunc('uniq');
const _compact  = emberArrayFunc('compact');

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

export default Ember.Mixin.create({
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
      var selection = this.selectionAsArray().map(function(item) {
        return Ember.get(item, valuePath);
      });
      var searchMatcher = this.makeSearchMatcher();

      var result = _compact(Ember.makeArray(this.get('content'))
        .map(function(item, index) {
          const label = Ember.get(item, labelPath);
          const value = Ember.get(item, valuePath);
          const group = groupPath ? Ember.get(item, groupPath) : null;
          if (searchMatcher(group) || searchMatcher(label)) {
            return Ember.Object.create({
              item:     item,
              itemId:   index,
              group:    group,
              label:    label,
              value:    value,
              selected: _contains(selection, value)
            });
          } else {
            return null;
          }
        }));

      if (Ember.isPresent(result)) {
        result.set('firstObject.first', true);
      }

      return result;
    }
  ),

  nestedGroupContentList: Ember.computed(
    'contentList.[].group',
    function() {
      const contentList = this.get('contentList');
      const groups = _uniq(_mapBy(contentList, 'group'));
      const results = Ember.A();
      groups.forEach(function(group) {
        results.pushObject(Ember.Object.create({
          name: group,
          items: _filterBy(contentList, 'group', group)
        }));
      });
      return results;
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
    'selectionLabels.[]', 'nothingSelectedMessage', 'multipleSelectedMessage',
    'summaryMessage', 'summaryMessageKey',
    function() {
      var selection  = this.get('selectionLabels');
      var count      = selection.get('length');
      var messageKey = this.get('summaryMessageKey');
      var message    = this.get('summaryMessage');
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
        // I18n is returning a string that's been escaped, we don't want the
        // string to get escaped again.
        return Ember.String.htmlSafe(translation);
      } else if (Ember.isPresent(message)) {
        return message;
      } else {
        switch (count) {
          case 0:
            return this.get('nothingSelectedMessage');
          case 1:
            return selection.get('firstObject');
          default:
            return Ember.String.fmt(
              this.get('multipleSelectedMessage'),
              count,
              selection.get('firstObject'),
              selection.join(', ')
            );
        }
      }
    }
  ),

  clearSearchDisabled: Ember.computed.empty('searchFilter'),

  toggleSelection: function(value) {
    var selection = Ember.A(this.get('selection'));
    if (_contains(selection, value)) {
      selection.removeObject(value);
    } else {
      selection.pushObject(value);
    }
    this.set('selection', selection);
  },

  selectAnItem: function(selected) {
    if (!this.get('disabled')) {
      if (this.get('multiple')) {
        this.set('keepDropdownOpen', true);
        this.toggleSelection(selected.get('item'));
      } else {
        this.setProperties({
          // TODO: value will be removed in the future
          value: selected.get('value'),
          selection: selected.get('item')
        });
      }
    }
  },

  sendChangeAction: function() {
    const changeAction = Ember.get(this, 'attrs.action');
    if (changeAction) {
      changeAction(this.get('selection'));
    }
  },

  actions: {
    selectItem(selected) {
      if (this.get('disabled')) { return true; }
      this.selectAnItem(selected);
      this.sendChangeAction();
      return false;
    },

    selectAllNone(listName) {
      if (this.get('disabled')) { return true; }
      this.get(listName).forEach(Ember.run.bind(this, this.selectAnItem));
      this.sendChangeAction();
      return false;
    },

    selectByValue() {
      if (this.get('disabled')) { return true; }
      const hasPrompt = Ember.isPresent(this.get('prompt'));
      const contentList = this.get('contentList');
      const selectedValues = Ember.makeArray(this.$('select').val());
      if (this.get('multiple')) {
        this.set('selection', contentList.filter(function(item) {
          return selectedValues.indexOf(item.get('value')) !== -1;
        }));
      } else if (hasPrompt && Ember.isEmpty(selectedValues[0])) {
        this.setProperties({value: null, selection: null});
      } else {
        this.send('selectItem', _findBy(contentList, 'value', selectedValues[0]));
      }
      this.sendChangeAction();
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
