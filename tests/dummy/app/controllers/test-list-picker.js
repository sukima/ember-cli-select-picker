import Ember from 'ember';

export default Ember.Controller.extend({
  theContent: [
    {name: 'First item',  id: 1},
    {name: 'Second item', id: 2},
    {name: 'Third item',  id: 3},
    {name: 'Another',     id: 4}
  ]
});
