import Ember from 'ember';
import { choicesToString, setChoicesAction } from '../modules/choices-props';

function popularity() {
  return chance.pick(['Great states', 'Awesome states']);
}

function stateList() {
  return Ember.computed(function() {
    return Ember.A(chance.states()
      .map(function(state) {
        return {label: state.name, value: state.name, group: popularity()};
      }))
      .sortBy('group', 'label');
  });
}

var SearchingController = Ember.Controller.extend({
  simpleSearchContent:      stateList(),
  simpleSearchChoices:      [],
  simpleSearchChoicesStr:   choicesToString('simpleSearchChoices'),

  advancedSearchContent:    stateList(),
  advancedSearchChoices:    [],
  advancedSearchChoicesStr: choicesToString('advancedSearchChoices'),

  listSearchContent:        stateList(),
  listSearchChoices:        [],
  listSearchChoicesStr:     choicesToString('listSearchChoices'),

  actions: {
    setSimpleSearchChoices:   setChoicesAction('simpleSearchValue'),
    setAdvancedSearchChoices: setChoicesAction('advancedSearchValue'),
    setListSearchChoices:     setChoicesAction('listSearchValue')
  }
});

export default SearchingController;
