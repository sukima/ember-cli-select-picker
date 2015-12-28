import Ember from 'ember';
import { setChoicesAction, choicesToString } from '../modules/choices-props';

export default Ember.Mixin.create({
  singleChoice:       [],
  singleChoiceStr:    Ember.computed.readOnly('singleChoice.firstObject.value'),

  multipleChoices:    [],
  multipleChoicesStr: choicesToString('multipleChoices'),

  listChoices:        [],
  listChoicesStr:     choicesToString('listChoices'),

  actions: {
    setSingleChoice:    setChoicesAction('singleChoice'),
    setMultipleChoices: setChoicesAction('multipleChoices'),
    setListChoices:     setChoicesAction('listChoices')
  }
});
