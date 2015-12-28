import Ember from 'ember';
import ChoicesMixin from '../mixins/choices';

function neighborhood() {
  return chance.pick(['East side', 'West side']);
}

var KeyboardController = Ember.Controller.extend(ChoicesMixin, {
  singleContent: Ember.computed(function() {
    return chance.unique(chance.street, 10)
      .map(function(street) {
        return {label: street, value: street};
      });
  }),

  multipleContent: Ember.computed(function() {
    return Ember.A(chance.unique(chance.street, 10)
      .map(function(street) {
        return {label: street, value: street, group: neighborhood()};
      }))
      .sortBy('group');
  })
});

export default KeyboardController;
