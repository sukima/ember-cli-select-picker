import Ember from 'ember';
import { test, module } from 'qunit';
import startApp from '../helpers/start-app';

var App;

function checkMarkVisibilityTest(selectPickerID) {
  var selector =
    `#${selectPickerID} .dropdown-menu li>a:eq(%@) span.check-mark`;
  return function(itemIndex) {
    return !find(Ember.String.fmt(selector, itemIndex)).hasClass('hidden');
  };
}

module('Select Picker Integration', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, App.destroy);
  }
});

test('Show and Hide', function(assert) {
  assert.expect(2);
  visit('/test-select-picker')

  .then(function() {
    assert.ok(
      find('#single-picker .dropdown-menu').is(':hidden'),
      'dropdown menu should be hidden'
    );
  })

  .click('#single-picker button.dropdown-toggle')

  .then(function() {
    assert.ok(
      find('#single-picker .dropdown-menu').is(':visible'),
      'dropdown menu should be visible'
    );
  });
});

test('Select multiple', function(assert) {
  var isChecked = checkMarkVisibilityTest('multiple-picker');

  assert.expect(3);

  visit('/test-select-picker')

  .click('#multiple-picker button.dropdown-toggle')
  .click('#multiple-picker .dropdown-menu li>a:eq(0)')
  .click('#multiple-picker .dropdown-menu li>a:eq(1)')

  .then(function() {
    // Dropdowns might not be visible causing the check mark to not be visible.
    // .is(':visible') and .is(':hidden') are not reliable tests for check
    // marks. use hasClass('hidden') instead.
    assert.ok(isChecked(0), 'first item should show a check mark');
    assert.ok(isChecked(1), 'second item should show a check mark');
    assert.ok(!isChecked(2), 'third item should not show a check mark');
  });
});

test('Select single', function(assert) {
  var isChecked = checkMarkVisibilityTest('single-picker');

  assert.expect(4);

  visit('/test-select-picker')

  .click('#single-picker button.dropdown-toggle')
  .click('#single-picker .dropdown-menu li>a:eq(0)')

  .then(function() {
    assert.ok(isChecked(0), 'first item should show a check mark');
    assert.ok(!isChecked(1), 'second item should not show a check mark');
  })

  .click('#single-picker .dropdown-menu li>a:eq(1)')

  .then(function() {
    assert.ok(!isChecked(0), 'first item should not show a check mark');
    assert.ok(isChecked(1), 'second item should show a check mark');
  });
});
