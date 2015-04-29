import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;

moduleForComponent('list-picker', {
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

var contentArray = 
  [
    {name: 'First item',    id:1},
    {name: 'Second item',   id:2},
    {name: 'Third item',    id:3},
    {name: 'Another',       id:4}
  ];

test('Selecting & De-selecting', function(assert) {
  // assert.expect();
  var component = this.subject({
    multiple: "true",
    content: contentArray,
    optionValuePath: 'content.id',
    optionLabelPath: 'content.name'
  });

  this.render();
  
  // Initial state.
  assert.equal(component.get('selection').length, 0);

  // Selecting All.
  $('button:contains("Select All")').click();
  assert.equal(component.get('selection').length, 4);

  // De-selecting All.
  $('button:contains("Select None")').click();
  assert.equal(component.get('selection').length, 0);

  // Manual multiple selection
  $('button:contains("First item")').click();
  $('button:contains("Second item")').click();
  assert.equal(component.get('selection').length, 2);

  $('button:contains("Select None")').click();
  assert.equal(component.get('selection').length, 0);

});

test('Normal Search', function(assert) {
  assert.expect(5);
    var component = this.subject({
    multiple: "true",
    liveSearch: "true",
    content: contentArray,
    optionValuePath: 'content.id',
    optionLabelPath: 'content.name'
  });

  this.render();
  // containerDiv is the div where all items filtered/unfiltered are listed.
  var searchFilter = $('.search-filter');

  assert.equal($('.list-picker-items-container').find('button').length, 4);

  // Only one Items has 'F' litter in it (First Item), So, Filtering should result in one item being listed
  fillIn(searchFilter, 'F');
  assert.equal($('.list-picker-items-container').find('button').length, 1);

  // The result should be 2 (First, Second)
  fillIn(searchFilter, 'S').then(function() {
    assert.equal($('.list-picker-items-container').find('button').length, 2);
  });

  // Clear Filter
  $('.list-picker-clear-filter').click();
  assert.equal($('.list-picker-items-container').find('button').length, 4);

  // When search is set to normal (not advanced), searching for 'itm' should give 0 results
  fillIn(searchFilter, 'itm').then(function() {
    assert.equal($('.list-picker-items-container').find('button').length, 0);
  });
});

test('Advanced Search', function(assert) {
  assert.expect(1);
    var component = this.subject({
    multiple: "true",
    liveSearch: "advanced",
    content: contentArray,
    optionValuePath: 'content.id',
    optionLabelPath: 'content.name'
  });

  this.render();

  var searchFilter = $('.search-filter');
  fillIn(searchFilter, 'itm');
  assert.equal($('.list-picker-items-container').find('button').length, 3);

});