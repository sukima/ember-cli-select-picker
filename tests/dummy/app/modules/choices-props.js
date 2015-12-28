import Ember from 'ember';

export function setChoicesAction(prop) {
  return function(selection) {
    this.set(prop, Ember.makeArray(selection));
  };
}

export function choicesToString(dependentProp) {
  return Ember.computed(`${dependentProp}.[].value`, function() {
    return Ember.A(this.get(dependentProp)).mapBy('value').join(', ');
  });
}
