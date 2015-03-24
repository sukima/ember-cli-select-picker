import Ember from 'ember';
import SelectPickerMixin from '../mixins/select-picker';

var I18nProps = (Ember.I18n && Ember.I18n.TranslateableProperties) || {};

var ListPickerComponent = Ember.Component.extend(
  SelectPickerMixin, I18nProps, {

  selectAllLabel:  'Select All',
  selectNoneLabel: 'Select None',

  classNames: ['select-picker', 'list-picker'],

  groupedContentList: function() {
    var groups = [];
    var content  = [];
    this.get('contentList').forEach(function(item) {
      var header;
      var groupIndex = groups.indexOf(item.group);
      if (groupIndex < 0) {
        header = item.group;
        groups.push(header);
        content.push({
          header: header,
          items: [item]
        });
      } else {
        content[groupIndex].items.push(item);
      }
    });
    return content;
  }.property('contentList.@each')
});

export default ListPickerComponent;
