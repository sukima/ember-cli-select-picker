import Ember from 'ember';
import ChoicesMixin from '../mixins/choices';

function neighborhood() {
  return chance.pick(['East side', 'West side']);
}

export default Ember.Controller.extend(ChoicesMixin, {
  showHelloDialog: false,

  prepMultipleValue: Ember.on('init', function() {
    var sample = this.get('multipleContent').slice(0, 4);
    this.set('multipleValue', sample);
  }),

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
  }),

  listContent: Ember.computed(function() {
    return Ember.A(chance.unique(chance.street, 10)
      .map(function(street) {
        return {label: street, value: street, group: neighborhood()};
      }))
      .sortBy('group');
  }),

  actions: {
    showHelloDialog() {
      this.set('showHelloDialog', true);
    },

    hideHelloDialog() {
      this.set('showHelloDialog', false);
    }
  }
});
