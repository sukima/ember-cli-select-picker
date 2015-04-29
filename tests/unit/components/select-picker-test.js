import { test, moduleForComponent } from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;

moduleForComponent('select-picker', {
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

test('clicking the dropDown should open the list', function(assert) {
  assert.expect(4);
  var component = this.subject();

  this.render();

  // Initially, the dropDown should not be open.
  assert.equal(component.get('showDropdown'), false);
  assert.ok(!$('.bs-select').hasClass('open'));


  // Triggering showHide action, Should open the dropDown
  Ember.run(function(){
    component.send('showHide');
  });
  assert.equal(component.get('showDropdown'), true);
  assert.ok($('.bs-select').hasClass('open'));
});

test('Multiple Selection', function(assert){
  assert.expect(9);
  var contentArray = 
    [
      {name: 'first',   id: 1},
      {name: 'second',  id: 2},
      {name: 'third',   id: 3}
    ];

  var component = this.subject({
    multiple: "true",
    content: contentArray, 
    optionValuePath: 'content.id',
    optionLabelPath: 'content.name'
  });
  
  this.render();
  var btnDropDown = $('button.dropdown-toggle');

  // Initial state.
  assert.equal(component.get('selection').length, 0);
  assert.equal(btnDropDown.text().trim(), 'Nothing Selected');

  // Selecting All.
  $('button:contains("All")').click();
  assert.equal(component.get('selection').length, 3);
  assert.equal(btnDropDown.text().trim(), '3 items selected');

  // Deselecting All.
  $('button:contains("None")').click();
  assert.equal(component.get('selection').length, 0);
  assert.equal(btnDropDown.text().trim(), 'Nothing Selected');

  // Selecting & Deselecting one item (e.g 2nd item)
  assert.equal(btnDropDown.text().trim(), 'Nothing Selected');
  $('a:contains("second")').click();
  assert.equal(btnDropDown.text().trim(), 'second');
  $('a:contains("second")').click();
  assert.equal(btnDropDown.text().trim(), 'Nothing Selected');

});


test('Single Selection', function(assert){
  assert.expect(5);
  var contentArray = 
  [
    {name: 'first',   id: 1},
    {name: 'second',  id: 2},
    {name: 'third',   id: 3}
  ];
  var component = this.subject({content: contentArray, optionValuePath:'content.id', optionLabelPath: 'content.name'});
  this.render();
  var btnDropDown = $('button.dropdown-toggle');

  // Initial state.
  assert.equal(component.get('selection').length, 0);
  assert.equal(btnDropDown.text().trim(), 'Nothing Selected');

  // Selecting & Deselecting one item (e.g 3nd item)
  assert.equal(btnDropDown.text().trim(), 'Nothing Selected');
  $('a:contains("third")').click();
  assert.equal(btnDropDown.text().trim(), 'third');

  // Selecting another Item, should deselect the last Item, and select the new one instead.
  $('a:contains("first")').click();
  assert.equal(btnDropDown.text().trim(), 'first');

});

