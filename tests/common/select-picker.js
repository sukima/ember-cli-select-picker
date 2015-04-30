import Ember from 'ember';
import { test } from 'ember-qunit';

const contentArray = [
  {name: 'First item',  id: 1},
  {name: 'Second item', id: 2},
  {name: 'Third item',  id: 3},
  {name: 'Another',     id: 4}
];

export default function() {
  test('updates contentList when selection changes', function(assert) {
    assert.expect(3);

    var component = this.subject({
      multiple: true,
      content: contentArray,
      selection: Ember.A(),
      optionValuePath: 'content.id',
      optionLabelPath: 'content.name'
    });

    Ember.run(function() {
      component.send('selectAllNone', 'unselectedContentList');
    });

    assert.equal(
      component.get('selection.length'), contentArray.length,
      'all items should be selected'
    );

    Ember.run(function() {
      component.send('selectAllNone', 'selectedContentList');
    });

    assert.equal(
      component.get('selection.length'), 0,
      'no items should be selected'
    );

    Ember.run(function() {
      component.send('selectItem', component.get('contentList.firstObject'));
    });

    assert.equal(
      component.get('selection.length'), 1,
      'no items should be selected'
    );
  });

  test('Normal Search', function(assert) {
    assert.expect(5);

    var component = this.subject({
      multiple: true,
      liveSearch: true,
      content: contentArray,
      selection: Ember.A(),
      optionValuePath: 'content.id',
      optionLabelPath: 'content.name'
    });

    assert.equal(
      component.get('contentList.length'), contentArray.length,
      'contentList should not be filtered initially'
    );

    Ember.run(function() {
      component.set('searchFilter', 'F');
    });

    // Only one Items has 'F' litter in it (First Item), So, Filtering should
    // result in one item being listed.
    assert.equal(
      component.get('contentList.length'), 1,
      'contentList should be filtered to one result for "F"'
    );

    Ember.run(function() {
      component.set('searchFilter', 'S');
    });

    // The result should be 2 (First, Second)
    assert.equal(
      component.get('contentList.length'), 2,
      'contentList should be filtered to two results for "S"'
    );

    Ember.run(function() {
      component.send('clearFilter');
    });

    assert.equal(
      component.get('contentList.length'), contentArray.length,
      'contentList should not be filtered when searchFilter is cleared'
    );

    Ember.run(function() {
      component.set('searchFilter', 'itm');
    });

    // When search is set to normal (not advanced), searching for 'itm' should
    // give 0 results
    assert.equal(
      component.get('contentList.length'), 0,
      'contentList should be filtered to no results for "itm"'
    );
  });

  test('Advanced Search', function(assert) {
    assert.expect(2);

    var component = this.subject({
      multiple: true,
      liveSearch: 'advanced',
      content: contentArray,
      selection: Ember.A(),
      optionValuePath: 'content.id',
      optionLabelPath: 'content.name'
    });

    assert.equal(
      component.get('contentList.length'), contentArray.length,
      'contentList should not be filtered initially'
    );

    Ember.run(function() {
      component.set('searchFilter', 'itm');
    });

    assert.equal(
      component.get('contentList.length'), 3,
      'contentList should be filtered to three results for "itm"'
    );
  });
}
