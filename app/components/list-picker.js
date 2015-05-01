import Ember from 'ember';
import SelectPickerMixin from 'ember-cli-select-picker/mixins/select-picker';

var I18nProps = (Ember.I18n && Ember.I18n.TranslateableProperties) || {};

var ListPickerComponent = Ember.Component.extend(
  SelectPickerMixin, I18nProps, {

  selectAllLabel:  'Select All',
  selectNoneLabel: 'Select None',

  nativeMobile: false,

  classNames: ['select-picker', 'list-picker'],

  groupedContentList: Ember.computed(
    'contentList.@each',
    function() {
      var groups = Ember.A();
      var content = Ember.A();
      this.get('contentList').forEach(function(item) {
        var header, itemGroup = item.get('group');
        var groupIndex = groups.indexOf(itemGroup);
        if (groupIndex < 0) {
          header = itemGroup;
          groups.push(header);
          content.push(Ember.Object.create({
            header: header,
            items: Ember.A([item])
          }));
        } else {
          content[groupIndex].get('items').push(item);
        }
      });
      return content;
    }
  )
});

export default ListPickerComponent;
