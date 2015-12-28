import Ember from 'ember';

export default Ember.Component.extend({
  lang: 'nohighlight',
  highlightCodeBlocks: Ember.on('didInsertElement', function() {
    hljs.highlightBlock(this.$('code').get(0));
  })
});
