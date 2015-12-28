"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('dummy/acceptance-tests/main', ['exports', 'ember-cli-sri/acceptance-tests/main'], function (exports, main) {

	'use strict';



	exports['default'] = main['default'];

});
define('dummy/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'dummy/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('dummy/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'dummy/config/environment'], function (exports, AppVersionComponent, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = AppVersionComponent['default'].extend({
    version: version,
    name: name
  });

});
define('dummy/components/highlight-code', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    lang: 'nohighlight',
    highlightCodeBlocks: Ember['default'].on('didInsertElement', function () {
      hljs.highlightBlock(this.$('code').get(0));
    })
  });

});
define('dummy/components/keyboard-select-picker', ['exports', 'ember', 'dummy/components/select-picker', 'ember-cli-select-picker/mixins/item-cursor'], function (exports, Ember, SelectPicker, ItemCursorMixin) {

  'use strict';

  var KEY_ENTER = 13;
  var KEY_ESC = 27;
  var KEY_UP = 38;
  var KEY_DOWN = 40;

  exports['default'] = SelectPicker['default'].extend(ItemCursorMixin['default'], {
    layoutName: 'components/select-picker',
    classNames: ['select-picker', 'keyboard-select-picker'],

    didInsertElement: function didInsertElement() {
      this.$().on('keydown.' + this.get('elementId'), Ember['default'].run.bind(this, 'handleKeyPress'));
    },

    willDestroyElement: function willDestroyElement() {
      this.$().off('keydown.' + this.get('elementId'));
    },

    focusActiveItem: function focusActiveItem() {
      this.$('[data-itemid=' + this.get('activeItem.itemId') + ']').focus();
    },

    handleKeyPress: function handleKeyPress(e) {
      var _this = this;

      var actionName = (function () {
        switch (e.which) {
          case KEY_DOWN:
            return 'activeNext';
          case KEY_UP:
            return 'activePrev';
          case KEY_ESC:
            return 'closeDropdown';
          case KEY_ENTER:
            return _this.get('showDropdown') ? 'selectActiveItem' : 'openDropdown';
          default:
            return null;
        }
      })();

      if (actionName) {
        e.preventDefault();
        Ember['default'].run(function () {
          _this.send(actionName);
        });
        this.focusActiveItem();
        return false;
      }

      return true;
    }
  });

});
define('dummy/components/list-picker', ['exports', 'ember', 'ember-cli-select-picker/mixins/select-picker'], function (exports, Ember, SelectPickerMixin) {

  'use strict';

  var I18nProps = Ember['default'].I18n && Ember['default'].I18n.TranslateableProperties || {};

  exports['default'] = Ember['default'].Component.extend(SelectPickerMixin['default'], I18nProps, {
    classNames: ['select-picker', 'list-picker'],
    selectAllLabel: 'Select All',
    selectNoneLabel: 'Select None',
    nativeMobile: false
  });

});
define('dummy/components/modal-dialog', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    isVisible: false,
    showHide: Ember['default'].observer('isVisible', function () {
      this.$('.modal').css({ display: this.get('isVisible') ? 'block' : 'none' });
    })
  });

});
define('dummy/components/select-picker', ['exports', 'ember', 'ember-cli-select-picker/mixins/select-picker'], function (exports, Ember, SelectPickerMixin) {

  'use strict';

  var I18nProps = Ember['default'].I18n && Ember['default'].I18n.TranslateableProperties || {};

  exports['default'] = Ember['default'].Component.extend(SelectPickerMixin['default'], I18nProps, {

    nothingSelectedMessage: 'Nothing Selected',
    summaryMessage: '%@ items selected',
    selectAllLabel: 'All',
    selectNoneLabel: 'None',

    nativeMobile: true,

    classNames: ['select-picker', 'btn-group'],
    buttonClass: 'btn-default',

    badgeEnabled: Ember['default'].computed.and('showBadge', 'multiple'),

    selectionBadge: Ember['default'].computed('selection.length', 'badgeEnabled', function () {
      var enabled = this.get('badgeEnabled');
      var selected = this.get('selection.length');
      return enabled && selected && selected !== 0 ? selected : '';
    }),

    setupDom: Ember['default'].on('didInsertElement', function () {
      var id = this.get('elementId');
      this.updateDropUp();
      $(document).on('click.' + id, Ember['default'].run.bind(this, this.hideDropdownMenu)).on('scroll.' + id, Ember['default'].run.bind(this, this.updateDropUp)).on('resize.' + id, Ember['default'].run.bind(this, this.updateDropUp));
    }),

    hideDropdownMenu: function hideDropdownMenu(evt) {
      if (this.get('keepDropdownOpen')) {
        this.set('keepDropdownOpen', false);
        return;
      }
      if (this.element && !$.contains(this.element, evt.target)) {
        this.send('closeDropdown');
      }
    },

    updateDropUp: function updateDropUp() {
      var windowHeight = $(window).height();
      var scrollTop = $(window).scrollTop();
      var buttonOffset = this.$().offset().top;
      var buttonHeight = this.$().height();
      var menuHeight = this.$('.dropdown-menu').height();
      var viewportOffset = buttonOffset - scrollTop;
      var menuBottom = viewportOffset + buttonHeight + menuHeight;
      this.set('isDropUp', menuBottom > windowHeight);
    },

    teardownDom: Ember['default'].on('willDestroyElement', function () {
      $(document).off('.' + this.get('elementId'));
    }),

    actions: {
      showHide: function showHide() {
        this.toggleProperty('showDropdown');
      },

      openDropdown: function openDropdown() {
        this.set('showDropdown', true);
      },

      closeDropdown: function closeDropdown() {
        this.set('showDropdown', false);
      }
    }
  });

});
define('dummy/controllers/application', ['exports', 'ember', 'dummy/config/environment'], function (exports, Ember, config) {

  'use strict';

  var ApplicationController = Ember['default'].Controller.extend({
    addonVersion: config['default'].APP.addonVersion
  });

  exports['default'] = ApplicationController;

});
define('dummy/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('dummy/controllers/index', ['exports', 'ember', 'dummy/mixins/choices'], function (exports, Ember, ChoicesMixin) {

  'use strict';

  function neighborhood() {
    return chance.pick(['East side', 'West side']);
  }

  exports['default'] = Ember['default'].Controller.extend(ChoicesMixin['default'], {
    singleContent: Ember['default'].computed(function () {
      return chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street };
      });
    }),

    multipleContent: Ember['default'].computed(function () {
      return Ember['default'].A(chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street, group: neighborhood() };
      })).sortBy('group');
    }),

    listContent: Ember['default'].computed(function () {
      return Ember['default'].A(chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street, group: neighborhood() };
      })).sortBy('group');
    })
  });

});
define('dummy/controllers/keyboard', ['exports', 'ember', 'dummy/mixins/choices'], function (exports, Ember, ChoicesMixin) {

  'use strict';

  function neighborhood() {
    return chance.pick(['East side', 'West side']);
  }

  var KeyboardController = Ember['default'].Controller.extend(ChoicesMixin['default'], {
    singleContent: Ember['default'].computed(function () {
      return chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street };
      });
    }),

    multipleContent: Ember['default'].computed(function () {
      return Ember['default'].A(chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street, group: neighborhood() };
      })).sortBy('group');
    })
  });

  exports['default'] = KeyboardController;

});
define('dummy/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('dummy/controllers/options', ['exports', 'ember', 'dummy/mixins/choices'], function (exports, Ember, ChoicesMixin) {

  'use strict';

  function neighborhood() {
    return chance.pick(['East side', 'West side']);
  }

  exports['default'] = Ember['default'].Controller.extend(ChoicesMixin['default'], {
    showHelloDialog: false,

    prepMultipleValue: Ember['default'].on('init', function () {
      var sample = this.get('multipleContent').slice(0, 4);
      this.set('multipleValue', sample);
    }),

    singleContent: Ember['default'].computed(function () {
      return chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street };
      });
    }),

    multipleContent: Ember['default'].computed(function () {
      return Ember['default'].A(chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street, group: neighborhood() };
      })).sortBy('group');
    }),

    listContent: Ember['default'].computed(function () {
      return Ember['default'].A(chance.unique(chance.street, 10).map(function (street) {
        return { label: street, value: street, group: neighborhood() };
      })).sortBy('group');
    }),

    actions: {
      showHelloDialog: function showHelloDialog() {
        this.set('showHelloDialog', true);
      },

      hideHelloDialog: function hideHelloDialog() {
        this.set('showHelloDialog', false);
      }
    }
  });

});
define('dummy/controllers/searching', ['exports', 'ember', 'dummy/modules/choices-props'], function (exports, Ember, choices_props) {

  'use strict';

  function popularity() {
    return chance.pick(['Great states', 'Awesome states']);
  }

  function stateList() {
    return Ember['default'].computed(function () {
      return Ember['default'].A(chance.states().map(function (state) {
        return { label: state.name, value: state.name, group: popularity() };
      })).sortBy('group', 'label');
    });
  }

  var SearchingController = Ember['default'].Controller.extend({
    simpleSearchContent: stateList(),
    simpleSearchChoices: [],
    simpleSearchChoicesStr: choices_props.choicesToString('simpleSearchChoices'),

    advancedSearchContent: stateList(),
    advancedSearchChoices: [],
    advancedSearchChoicesStr: choices_props.choicesToString('advancedSearchChoices'),

    listSearchContent: stateList(),
    listSearchChoices: [],
    listSearchChoicesStr: choices_props.choicesToString('listSearchChoices'),

    actions: {
      setSimpleSearchChoices: choices_props.setChoicesAction('simpleSearchValue'),
      setAdvancedSearchChoices: choices_props.setChoicesAction('advancedSearchValue'),
      setListSearchChoices: choices_props.setChoicesAction('listSearchValue')
    }
  });

  exports['default'] = SearchingController;

});
define('dummy/controllers/test-list-picker', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    theContent: [{ name: 'First item', id: 1 }, { name: 'Second item', id: 2 }, { name: 'Third item', id: 3 }, { name: 'Another', id: 4 }]
  });

});
define('dummy/controllers/test-select-picker', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    theContent: [{ name: 'First item', id: 1 }, { name: 'Second item', id: 2 }, { name: 'Third item', id: 3 }, { name: 'Another', id: 4 }]
  });

});
define('dummy/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'dummy/config/environment'], function (exports, initializerFactory, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = {
    name: 'App Version',
    initialize: initializerFactory['default'](name, version)
  };

});
define('dummy/initializers/export-application-global', ['exports', 'ember', 'dummy/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('dummy/mixins/choices', ['exports', 'ember', 'dummy/modules/choices-props'], function (exports, Ember, choices_props) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({
    singleChoice: [],
    singleChoiceStr: Ember['default'].computed.readOnly('singleChoice.firstObject.value'),

    multipleChoices: [],
    multipleChoicesStr: choices_props.choicesToString('multipleChoices'),

    listChoices: [],
    listChoicesStr: choices_props.choicesToString('listChoices'),

    actions: {
      setSingleChoice: choices_props.setChoicesAction('singleChoice'),
      setMultipleChoices: choices_props.setChoicesAction('multipleChoices'),
      setListChoices: choices_props.setChoicesAction('listChoices')
    }
  });

});
define('dummy/modules/choices-props', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.setChoicesAction = setChoicesAction;
  exports.choicesToString = choicesToString;

  function setChoicesAction(prop) {
    return function (selection) {
      this.set(prop, Ember['default'].makeArray(selection));
    };
  }

  function choicesToString(dependentProp) {
    return Ember['default'].computed(dependentProp + '.[].value', function () {
      return Ember['default'].A(this.get(dependentProp)).mapBy('value').join(', ');
    });
  }

});
define('dummy/router', ['exports', 'ember', 'dummy/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType,
    rootURL: config['default'].baseURL
  });

  Router.map(function () {
    this.route('test-select-picker');
    this.route('test-list-picker');
    this.route('install');
    this.route('searching');
    this.route('options');
    this.route('i18n');
    this.route('keyboard');
  });

  exports['default'] = Router;

});
define('dummy/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 9,
                "column": 8
              },
              "end": {
                "line": 9,
                "column": 52
              }
            },
            "moduleName": "dummy/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Intro");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 6
            },
            "end": {
              "line": 10,
              "column": 6
            }
          },
          "moduleName": "dummy/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["index"],["class","btn btn-lg"],0,null,["loc",[null,[9,8],[9,64]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 12,
                "column": 8
              },
              "end": {
                "line": 12,
                "column": 59
              }
            },
            "moduleName": "dummy/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Installing");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 6
            },
            "end": {
              "line": 13,
              "column": 6
            }
          },
          "moduleName": "dummy/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["install"],["class","btn btn-lg"],0,null,["loc",[null,[12,8],[12,71]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 15,
                "column": 8
              },
              "end": {
                "line": 15,
                "column": 60
              }
            },
            "moduleName": "dummy/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Searching");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 14,
              "column": 6
            },
            "end": {
              "line": 16,
              "column": 6
            }
          },
          "moduleName": "dummy/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["searching"],["class","btn btn-lg"],0,null,["loc",[null,[15,8],[15,72]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 18,
                "column": 8
              },
              "end": {
                "line": 18,
                "column": 56
              }
            },
            "moduleName": "dummy/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Options");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 6
            },
            "end": {
              "line": 19,
              "column": 6
            }
          },
          "moduleName": "dummy/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["options"],["class","btn btn-lg"],0,null,["loc",[null,[18,8],[18,68]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child4 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 21,
                "column": 8
              },
              "end": {
                "line": 21,
                "column": 66
              }
            },
            "moduleName": "dummy/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Internationalization");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 20,
              "column": 6
            },
            "end": {
              "line": 22,
              "column": 6
            }
          },
          "moduleName": "dummy/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["i18n"],["class","btn btn-lg"],0,null,["loc",[null,[21,8],[21,78]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child5 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 24,
                "column": 8
              },
              "end": {
                "line": 24,
                "column": 66
              }
            },
            "moduleName": "dummy/templates/application.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("Keyboard Support");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 23,
              "column": 6
            },
            "end": {
              "line": 25,
              "column": 6
            }
          },
          "moduleName": "dummy/templates/application.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["block","link-to",["keyboard"],["class","btn btn-lg"],0,null,["loc",[null,[24,8],[24,78]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 45,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container-fluid");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","jumbotron");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("Select Picker");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("An Ember based reinvention of the select picker for Bootstrap 3.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createElement("small");
        var el5 = dom.createTextNode("Version: ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("ul");
        dom.setAttribute(el3,"class","nav nav-pills");
        var el4 = dom.createTextNode("\n");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [7]);
        var morphs = new Array(8);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [5, 0]),1,1);
        morphs[1] = dom.createMorphAt(element2,1,1);
        morphs[2] = dom.createMorphAt(element2,2,2);
        morphs[3] = dom.createMorphAt(element2,3,3);
        morphs[4] = dom.createMorphAt(element2,4,4);
        morphs[5] = dom.createMorphAt(element2,5,5);
        morphs[6] = dom.createMorphAt(element2,6,6);
        morphs[7] = dom.createMorphAt(element0,3,3);
        return morphs;
      },
      statements: [
        ["content","addonVersion",["loc",[null,[5,23],[5,39]]]],
        ["block","link-to",["index"],["tagName","li"],0,null,["loc",[null,[8,6],[10,18]]]],
        ["block","link-to",["install"],["tagName","li"],1,null,["loc",[null,[11,6],[13,18]]]],
        ["block","link-to",["searching"],["tagName","li"],2,null,["loc",[null,[14,6],[16,18]]]],
        ["block","link-to",["options"],["tagName","li"],3,null,["loc",[null,[17,6],[19,18]]]],
        ["block","link-to",["i18n"],["tagName","li"],4,null,["loc",[null,[20,6],[22,18]]]],
        ["block","link-to",["keyboard"],["tagName","li"],5,null,["loc",[null,[23,6],[25,18]]]],
        ["content","outlet",["loc",[null,[30,2],[30,12]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5]
    };
  }()));

});
define('dummy/templates/components/-native-select', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 2
            },
            "end": {
              "line": 7,
              "column": 2
            }
          },
          "moduleName": "dummy/templates/components/-native-select.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          dom.setAttribute(el1,"value","");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          return morphs;
        },
        statements: [
          ["content","promptMessage",["loc",[null,[6,21],[6,38]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            meta: {
              "revision": "Ember@1.13.8",
              "loc": {
                "source": null,
                "start": {
                  "line": 11,
                  "column": 8
                },
                "end": {
                  "line": 13,
                  "column": 8
                }
              },
              "moduleName": "dummy/templates/components/-native-select.hbs"
            },
            arity: 1,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("          ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("option");
              var el2 = dom.createComment("");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
              var element1 = dom.childAt(fragment, [1]);
              var morphs = new Array(3);
              morphs[0] = dom.createAttrMorph(element1, 'value');
              morphs[1] = dom.createAttrMorph(element1, 'selected');
              morphs[2] = dom.createMorphAt(element1,0,0);
              return morphs;
            },
            statements: [
              ["attribute","value",["get","item.value",["loc",[null,[12,26],[12,36]]]]],
              ["attribute","selected",["get","item.selected",["loc",[null,[12,50],[12,63]]]]],
              ["content","item.label",["loc",[null,[12,66],[12,80]]]]
            ],
            locals: ["item"],
            templates: []
          };
        }());
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 9,
                "column": 4
              },
              "end": {
                "line": 15,
                "column": 4
              }
            },
            "moduleName": "dummy/templates/components/-native-select.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("optgroup");
            var el2 = dom.createTextNode("\n");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createAttrMorph(element2, 'label');
            morphs[1] = dom.createMorphAt(element2,1,1);
            return morphs;
          },
          statements: [
            ["attribute","label",["get","group.name",["loc",[null,[10,24],[10,34]]]]],
            ["block","each",[["get","group.items",["loc",[null,[11,16],[11,27]]]]],[],0,null,["loc",[null,[11,8],[13,17]]]]
          ],
          locals: ["group"],
          templates: [child0]
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 2
            },
            "end": {
              "line": 16,
              "column": 2
            }
          },
          "moduleName": "dummy/templates/components/-native-select.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","each",[["get","nestedGroupContentList",["loc",[null,[9,12],[9,34]]]]],[],0,null,["loc",[null,[9,4],[15,13]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 17,
                "column": 4
              },
              "end": {
                "line": 19,
                "column": 4
              }
            },
            "moduleName": "dummy/templates/components/-native-select.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("option");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(3);
            morphs[0] = dom.createAttrMorph(element0, 'value');
            morphs[1] = dom.createAttrMorph(element0, 'selected');
            morphs[2] = dom.createMorphAt(element0,0,0);
            return morphs;
          },
          statements: [
            ["attribute","value",["get","item.value",["loc",[null,[18,22],[18,32]]]]],
            ["attribute","selected",["get","item.selected",["loc",[null,[18,46],[18,59]]]]],
            ["content","item.label",["loc",[null,[18,62],[18,76]]]]
          ],
          locals: ["item"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 2
            },
            "end": {
              "line": 20,
              "column": 2
            }
          },
          "moduleName": "dummy/templates/components/-native-select.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","each",[["get","contentList",["loc",[null,[17,12],[17,23]]]]],[],0,null,["loc",[null,[17,4],[19,13]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 22,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/components/-native-select.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("select");
        dom.setAttribute(el1,"class","native-select form-control");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element3 = dom.childAt(fragment, [0]);
        var morphs = new Array(5);
        morphs[0] = dom.createAttrMorph(element3, 'title');
        morphs[1] = dom.createAttrMorph(element3, 'multiple');
        morphs[2] = dom.createElementMorph(element3);
        morphs[3] = dom.createMorphAt(element3,1,1);
        morphs[4] = dom.createMorphAt(element3,2,2);
        return morphs;
      },
      statements: [
        ["attribute","title",["get","title",["loc",[null,[2,16],[2,21]]]]],
        ["attribute","multiple",["get","multiple",["loc",[null,[3,19],[3,27]]]]],
        ["element","action",["selectByValue"],["on","change"],["loc",[null,[4,8],[4,46]]]],
        ["block","if",[["get","showNativePrompt",["loc",[null,[5,8],[5,24]]]]],[],0,null,["loc",[null,[5,2],[7,9]]]],
        ["block","if",[["get","nestedGroupContentList.firstObject.name",["loc",[null,[8,8],[8,47]]]]],[],1,2,["loc",[null,[8,2],[20,9]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('dummy/templates/components/highlight-code', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/components/highlight-code.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("pre");
        var el2 = dom.createElement("code");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 0]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element0, 'class');
        morphs[1] = dom.createMorphAt(element0,0,0);
        return morphs;
      },
      statements: [
        ["attribute","class",["concat",[["get","lang",["loc",[null,[1,20],[1,24]]]]]]],
        ["content","yield",["loc",[null,[1,28],[1,37]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dummy/templates/components/list-picker', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/components/list-picker.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","visible-xs-inline");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element9 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(element9,1,1);
          morphs[1] = dom.createMorphAt(element9,3,3);
          return morphs;
        },
        statements: [
          ["content","yield",["loc",[null,[3,4],[3,13]]]],
          ["inline","partial",["components/native-select"],[],["loc",[null,[4,4],[4,42]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 2
            },
            "end": {
              "line": 23,
              "column": 2
            }
          },
          "moduleName": "dummy/templates/components/list-picker.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","input-group");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("span");
          dom.setAttribute(el2,"class","input-group-btn");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("button");
          dom.setAttribute(el3,"type","button");
          dom.setAttribute(el3,"class","btn btn-default list-picker-clear-filter");
          var el4 = dom.createTextNode("\n          ");
          dom.appendChild(el3, el4);
          var el4 = dom.createElement("span");
          dom.setAttribute(el4,"class","glyphicon glyphicon-remove");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("\n        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element7 = dom.childAt(fragment, [1]);
          var element8 = dom.childAt(element7, [3, 1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(element7,1,1);
          morphs[1] = dom.createAttrMorph(element8, 'disabled');
          morphs[2] = dom.createElementMorph(element8);
          return morphs;
        },
        statements: [
          ["inline","input",[],["type","text","class","search-filter form-control","value",["subexpr","@mut",[["get","searchFilter",["loc",[null,[13,67],[13,79]]]]],[],[]],"focus","preventClosing"],["loc",[null,[13,6],[13,104]]]],
          ["attribute","disabled",["get","clearSearchDisabled",["loc",[null,[17,27],[17,46]]]]],
          ["element","action",["clearFilter"],[],["loc",[null,[18,16],[18,40]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 25,
                "column": 4
              },
              "end": {
                "line": 30,
                "column": 4
              }
            },
            "moduleName": "dummy/templates/components/list-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","btn-group select-all-none");
            dom.setAttribute(el1,"role","group");
            dom.setAttribute(el1,"aria-label","Select all or none");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"type","button");
            dom.setAttribute(el2,"class","btn btn-default");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"type","button");
            dom.setAttribute(el2,"class","btn btn-default");
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element4 = dom.childAt(fragment, [1]);
            var element5 = dom.childAt(element4, [1]);
            var element6 = dom.childAt(element4, [3]);
            var morphs = new Array(4);
            morphs[0] = dom.createElementMorph(element5);
            morphs[1] = dom.createMorphAt(element5,0,0);
            morphs[2] = dom.createElementMorph(element6);
            morphs[3] = dom.createMorphAt(element6,0,0);
            return morphs;
          },
          statements: [
            ["element","action",["selectAllNone","unselectedContentList"],[],["loc",[null,[27,54],[27,104]]]],
            ["content","selectAllLabel",["loc",[null,[27,105],[27,123]]]],
            ["element","action",["selectAllNone","selectedContentList"],[],["loc",[null,[28,54],[28,102]]]],
            ["content","selectNoneLabel",["loc",[null,[28,103],[28,122]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 30,
                "column": 4
              },
              "end": {
                "line": 37,
                "column": 4
              }
            },
            "moduleName": "dummy/templates/components/list-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"role","group");
            dom.setAttribute(el1,"class","btn-group-vertical btn-block");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"type","button");
            dom.setAttribute(el2,"class","btn btn-default");
            var el3 = dom.createTextNode("\n          ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n          ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("span");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n        ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [1, 1]);
            var element3 = dom.childAt(element2, [3]);
            var morphs = new Array(3);
            morphs[0] = dom.createElementMorph(element2);
            morphs[1] = dom.createMorphAt(element2,1,1);
            morphs[2] = dom.createAttrMorph(element3, 'class');
            return morphs;
          },
          statements: [
            ["element","action",["toggleSelectAllNone"],[],["loc",[null,[32,54],[32,86]]]],
            ["content","selectAllNoneLabel",["loc",[null,[33,10],[33,32]]]],
            ["attribute","class",["concat",["check-mark glyphicon ",["get","glyphiconClass",["loc",[null,[34,46],[34,60]]]]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 24,
              "column": 2
            },
            "end": {
              "line": 38,
              "column": 2
            }
          },
          "moduleName": "dummy/templates/components/list-picker.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","if",[["get","splitAllNoneButtons",["loc",[null,[25,10],[25,29]]]]],[],0,1,["loc",[null,[25,4],[37,11]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 40,
                "column": 4
              },
              "end": {
                "line": 40,
                "column": 65
              }
            },
            "moduleName": "dummy/templates/components/list-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("h4");
            dom.setAttribute(el1,"role","presentation");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
            return morphs;
          },
          statements: [
            ["content","group.name",["loc",[null,[40,46],[40,60]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 42,
                "column": 6
              },
              "end": {
                "line": 49,
                "column": 6
              }
            },
            "moduleName": "dummy/templates/components/list-picker.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"role","presentation");
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var element1 = dom.childAt(element0, [3]);
            var morphs = new Array(4);
            morphs[0] = dom.createAttrMorph(element0, 'class');
            morphs[1] = dom.createElementMorph(element0);
            morphs[2] = dom.createMorphAt(element0,1,1);
            morphs[3] = dom.createAttrMorph(element1, 'class');
            return morphs;
          },
          statements: [
            ["attribute","class",["concat",["btn btn-default ",["subexpr","if",[["get","item.selected",["loc",[null,[45,44],[45,57]]]],"active"],[],["loc",[null,[45,39],[45,68]]]]]]],
            ["element","action",["selectItem",["get","item",["loc",[null,[44,38],[44,42]]]]],[],["loc",[null,[44,16],[44,44]]]],
            ["content","item.label",["loc",[null,[46,10],[46,24]]]],
            ["attribute","class",["concat",["glyphicon glyphicon-ok check-mark ",["subexpr","unless",[["get","item.selected",["loc",[null,[47,66],[47,79]]]],"invisible"],[],["loc",[null,[47,57],[47,93]]]]]]]
          ],
          locals: ["item"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 39,
              "column": 2
            },
            "end": {
              "line": 51,
              "column": 2
            }
          },
          "moduleName": "dummy/templates/components/list-picker.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"role","group");
          dom.setAttribute(el1,"class","btn-group-vertical btn-block list-picker-items-container");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          morphs[1] = dom.createMorphAt(dom.childAt(fragment, [3]),1,1);
          return morphs;
        },
        statements: [
          ["block","if",[["get","group.name",["loc",[null,[40,10],[40,20]]]]],[],0,null,["loc",[null,[40,4],[40,72]]]],
          ["block","each",[["get","group.items",["loc",[null,[42,14],[42,25]]]]],[],1,null,["loc",[null,[42,6],[49,15]]]]
        ],
        locals: ["group"],
        templates: [child0, child1]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 53,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/components/list-picker.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element10 = dom.childAt(fragment, [2]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createAttrMorph(element10, 'class');
        morphs[2] = dom.createMorphAt(element10,1,1);
        morphs[3] = dom.createMorphAt(element10,3,3);
        morphs[4] = dom.createMorphAt(element10,4,4);
        morphs[5] = dom.createMorphAt(element10,5,5);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["block","if",[["get","nativeMobile",["loc",[null,[1,6],[1,18]]]]],[],0,null,["loc",[null,[1,0],[6,7]]]],
        ["attribute","class",["concat",["bs-select ",["subexpr","if",[["get","nativeMobile",["loc",[null,[8,27],[8,39]]]],"hidden-xs"],[],["loc",[null,[8,22],[8,53]]]]," ",["subexpr","if",[["get","disabled",["loc",[null,[8,59],[8,67]]]],"disabled"],[],["loc",[null,[8,54],[8,80]]]]]]],
        ["content","yield",["loc",[null,[9,2],[9,11]]]],
        ["block","if",[["get","liveSearch",["loc",[null,[11,8],[11,18]]]]],[],1,null,["loc",[null,[11,2],[23,9]]]],
        ["block","if",[["get","multiple",["loc",[null,[24,8],[24,16]]]]],[],2,null,["loc",[null,[24,2],[38,9]]]],
        ["block","each",[["get","nestedGroupContentList",["loc",[null,[39,10],[39,32]]]]],[],3,null,["loc",[null,[39,2],[51,11]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  }()));

});
define('dummy/templates/components/modal-dialog', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 17,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/components/modal-dialog.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"tabindex","-1");
        dom.setAttribute(el1,"role","dialog");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","modal-dialog");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","modal-content");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","modal-header");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"class","close");
        dom.setAttribute(el5,"data-dismiss","modal");
        dom.setAttribute(el5,"aria-label","Close");
        var el6 = dom.createElement("span");
        dom.setAttribute(el6,"aria-hidden","true");
        var el7 = dom.createTextNode("×");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("h4");
        dom.setAttribute(el5,"class","modal-title");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","modal-body");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","modal-footer");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("button");
        dom.setAttribute(el5,"type","button");
        dom.setAttribute(el5,"class","btn btn-default");
        dom.setAttribute(el5,"data-dismiss","modal");
        var el6 = dom.createTextNode("Dismiss");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1, 1]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element2, [1]);
        var element4 = dom.childAt(element1, [5, 1]);
        var morphs = new Array(5);
        morphs[0] = dom.createAttrMorph(element0, 'class');
        morphs[1] = dom.createElementMorph(element3);
        morphs[2] = dom.createMorphAt(dom.childAt(element2, [3]),0,0);
        morphs[3] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        morphs[4] = dom.createElementMorph(element4);
        return morphs;
      },
      statements: [
        ["attribute","class",["concat",["modal fade ",["subexpr","if",[["get","isVisible",["loc",[null,[1,28],[1,37]]]],"in"],[],["loc",[null,[1,23],[1,44]]]]]]],
        ["element","action",[["get","attrs.onDismiss",["loc",[null,[5,93],[5,108]]]]],[],["loc",[null,[5,84],[5,110]]]],
        ["content","title",["loc",[null,[6,32],[6,41]]]],
        ["content","yield",["loc",[null,[9,8],[9,17]]]],
        ["element","action",[["get","attrs.onDismiss",["loc",[null,[12,84],[12,99]]]]],[],["loc",[null,[12,75],[12,101]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dummy/templates/components/select-picker', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 6,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/components/select-picker.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","visible-xs-inline");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element8 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(element8,1,1);
          morphs[1] = dom.createMorphAt(element8,3,3);
          return morphs;
        },
        statements: [
          ["content","yield",["loc",[null,[3,4],[3,13]]]],
          ["inline","partial",["components/native-select"],[],["loc",[null,[4,4],[4,42]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 25,
              "column": 4
            },
            "end": {
              "line": 34,
              "column": 4
            }
          },
          "moduleName": "dummy/templates/components/select-picker.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"tabindex","-1");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          return morphs;
        },
        statements: [
          ["inline","input",[],["type","text","tabindex","-1","disabled",["subexpr","@mut",[["get","disabled",["loc",[null,[29,25],[29,33]]]]],[],[]],"class","search-filter form-control","value",["subexpr","@mut",[["get","searchFilter",["loc",[null,[31,22],[31,34]]]]],[],[]],"focus","preventClosing"],["loc",[null,[27,8],[32,40]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 37,
                "column": 8
              },
              "end": {
                "line": 54,
                "column": 8
              }
            },
            "moduleName": "dummy/templates/components/select-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","btn-group select-all-none btn-block");
            dom.setAttribute(el1,"role","group");
            dom.setAttribute(el1,"aria-label","Select all or none");
            dom.setAttribute(el1,"tabindex","-1");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"type","button");
            dom.setAttribute(el2,"class","btn btn-default btn-xs");
            dom.setAttribute(el2,"tabindex","-1");
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("button");
            dom.setAttribute(el2,"type","button");
            dom.setAttribute(el2,"class","btn btn-default btn-xs");
            dom.setAttribute(el2,"tabindex","-1");
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element5 = dom.childAt(fragment, [1]);
            var element6 = dom.childAt(element5, [1]);
            var element7 = dom.childAt(element5, [3]);
            var morphs = new Array(6);
            morphs[0] = dom.createAttrMorph(element6, 'disabled');
            morphs[1] = dom.createElementMorph(element6);
            morphs[2] = dom.createMorphAt(element6,1,1);
            morphs[3] = dom.createAttrMorph(element7, 'disabled');
            morphs[4] = dom.createElementMorph(element7);
            morphs[5] = dom.createMorphAt(element7,1,1);
            return morphs;
          },
          statements: [
            ["attribute","disabled",["get","disabled",["loc",[null,[40,31],[40,39]]]]],
            ["element","action",["selectAllNone","unselectedContentList"],[],["loc",[null,[42,20],[42,70]]]],
            ["content","selectAllLabel",["loc",[null,[44,14],[44,32]]]],
            ["attribute","disabled",["get","disabled",["loc",[null,[47,31],[47,39]]]]],
            ["element","action",["selectAllNone","selectedContentList"],[],["loc",[null,[49,20],[49,68]]]],
            ["content","selectNoneLabel",["loc",[null,[51,14],[51,33]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 54,
                "column": 8
              },
              "end": {
                "line": 59,
                "column": 8
              }
            },
            "moduleName": "dummy/templates/components/select-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1,"type","button");
            dom.setAttribute(el1,"class","btn btn-default btn-xs btn-block");
            dom.setAttribute(el1,"tabindex","-1");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.setAttribute(el2,"tabindex","-1");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element3 = dom.childAt(fragment, [1]);
            var element4 = dom.childAt(element3, [3]);
            var morphs = new Array(3);
            morphs[0] = dom.createElementMorph(element3);
            morphs[1] = dom.createMorphAt(element3,1,1);
            morphs[2] = dom.createAttrMorph(element4, 'class');
            return morphs;
          },
          statements: [
            ["element","action",["toggleSelectAllNone"],[],["loc",[null,[55,73],[55,105]]]],
            ["content","selectAllNoneLabel",["loc",[null,[56,12],[56,34]]]],
            ["attribute","class",["concat",["check-mark glyphicon ",["get","glyphiconClass",["loc",[null,[57,48],[57,62]]]]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 35,
              "column": 4
            },
            "end": {
              "line": 61,
              "column": 4
            }
          },
          "moduleName": "dummy/templates/components/select-picker.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          dom.setAttribute(el1,"tabindex","-1");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]),1,1);
          return morphs;
        },
        statements: [
          ["block","if",[["get","splitAllNoneButtons",["loc",[null,[37,14],[37,33]]]]],[],0,1,["loc",[null,[37,8],[59,15]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    var child3 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 63,
                "column": 6
              },
              "end": {
                "line": 63,
                "column": 106
              }
            },
            "moduleName": "dummy/templates/components/select-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"class","divider");
            dom.setAttribute(el1,"role","presentation");
            dom.setAttribute(el1,"tabindex","-1");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 64,
                "column": 6
              },
              "end": {
                "line": 64,
                "column": 105
              }
            },
            "moduleName": "dummy/templates/components/select-picker.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"class","dropdown-header");
            dom.setAttribute(el1,"role","presentation");
            dom.setAttribute(el1,"tabindex","-1");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),0,0);
            return morphs;
          },
          statements: [
            ["content","group.name",["loc",[null,[64,86],[64,100]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child2 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.8",
            "loc": {
              "source": null,
              "start": {
                "line": 65,
                "column": 6
              },
              "end": {
                "line": 72,
                "column": 6
              }
            },
            "moduleName": "dummy/templates/components/select-picker.hbs"
          },
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            dom.setAttribute(el1,"role","presentation");
            dom.setAttribute(el1,"tabindex","-1");
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("a");
            dom.setAttribute(el2,"role","menuitem");
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("span");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n          ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var element1 = dom.childAt(element0, [1]);
            var element2 = dom.childAt(element1, [3]);
            var morphs = new Array(6);
            morphs[0] = dom.createAttrMorph(element0, 'class');
            morphs[1] = dom.createAttrMorph(element1, 'data-itemid');
            morphs[2] = dom.createAttrMorph(element1, 'tabindex');
            morphs[3] = dom.createElementMorph(element1);
            morphs[4] = dom.createMorphAt(element1,1,1);
            morphs[5] = dom.createAttrMorph(element2, 'class');
            return morphs;
          },
          statements: [
            ["attribute","class",["concat",[["subexpr","if",[["get","disabled",["loc",[null,[66,58],[66,66]]]],"disabled"],[],["loc",[null,[66,53],[66,79]]]]," ",["subexpr","if",[["get","item.active",["loc",[null,[66,85],[66,96]]]],"active"],[],["loc",[null,[66,80],[66,107]]]]," ",["subexpr","if",[["get","item.selected",["loc",[null,[66,113],[66,126]]]],"selected"],[],["loc",[null,[66,108],[66,139]]]]]]],
            ["attribute","data-itemid",["get","item.itemId",["loc",[null,[67,43],[67,54]]]]],
            ["attribute","tabindex",["concat",[["subexpr","if",[["get","item.active",["loc",[null,[67,72],[67,83]]]],"0","-1"],[],["loc",[null,[67,67],[67,94]]]]]]],
            ["element","action",["selectItem",["get","item",["loc",[null,[67,118],[67,122]]]]],[],["loc",[null,[67,96],[67,124]]]],
            ["content","item.label",["loc",[null,[68,12],[68,26]]]],
            ["attribute","class",["concat",["glyphicon glyphicon-ok check-mark ",["subexpr","if",[["get","item.selected",["loc",[null,[69,64],[69,77]]]],"","hidden"],[],["loc",[null,[69,59],[69,91]]]]]]]
          ],
          locals: ["item"],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 62,
              "column": 4
            },
            "end": {
              "line": 73,
              "column": 4
            }
          },
          "moduleName": "dummy/templates/components/select-picker.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          morphs[1] = dom.createMorphAt(fragment,3,3,contextualElement);
          morphs[2] = dom.createMorphAt(fragment,5,5,contextualElement);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","unless",[["get","group.items.firstObject.first",["loc",[null,[63,16],[63,45]]]]],[],0,null,["loc",[null,[63,6],[63,117]]]],
          ["block","if",[["get","group.name",["loc",[null,[64,12],[64,22]]]]],[],1,null,["loc",[null,[64,6],[64,112]]]],
          ["block","each",[["get","group.items",["loc",[null,[65,14],[65,25]]]]],[],2,null,["loc",[null,[65,6],[72,15]]]]
        ],
        locals: ["group"],
        templates: [child0, child1, child2]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 76,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/components/select-picker.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"tabindex","0");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"type","button");
        dom.setAttribute(el2,"tabindex","-1");
        dom.setAttribute(el2,"aria-expanded","true");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3,"class","pull-left");
        dom.setAttribute(el3,"tabindex","-1");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("span");
        dom.setAttribute(el4,"tabindex","-1");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2,"class","dropdown-menu");
        dom.setAttribute(el2,"role","menu");
        dom.setAttribute(el2,"tabindex","-1");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("li");
        dom.setAttribute(el3,"tabindex","-1");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element9 = dom.childAt(fragment, [2]);
        var element10 = dom.childAt(element9, [1]);
        var element11 = dom.childAt(element10, [1]);
        var element12 = dom.childAt(element11, [3]);
        var element13 = dom.childAt(element9, [3]);
        var morphs = new Array(13);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createAttrMorph(element9, 'class');
        morphs[2] = dom.createAttrMorph(element10, 'class');
        morphs[3] = dom.createAttrMorph(element10, 'id');
        morphs[4] = dom.createElementMorph(element10);
        morphs[5] = dom.createMorphAt(element11,1,1);
        morphs[6] = dom.createAttrMorph(element12, 'class');
        morphs[7] = dom.createMorphAt(element12,0,0);
        morphs[8] = dom.createAttrMorph(element13, 'aria-labelledby');
        morphs[9] = dom.createMorphAt(dom.childAt(element13, [1]),1,1);
        morphs[10] = dom.createMorphAt(element13,3,3);
        morphs[11] = dom.createMorphAt(element13,4,4);
        morphs[12] = dom.createMorphAt(element13,5,5);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["block","if",[["get","nativeMobile",["loc",[null,[1,6],[1,18]]]]],[],0,null,["loc",[null,[1,0],[6,7]]]],
        ["attribute","class",["concat",["bs-select dropdown ",["subexpr","if",[["get","isDropUp",["loc",[null,[8,36],[8,44]]]],"dropup"],[],["loc",[null,[8,31],[8,55]]]]," ",["subexpr","if",[["get","nativeMobile",["loc",[null,[8,61],[8,73]]]],"hidden-xs"],[],["loc",[null,[8,56],[8,87]]]]," ",["subexpr","if",[["get","disabled",["loc",[null,[8,93],[8,101]]]],"disabled"],[],["loc",[null,[8,88],[8,114]]]]," ",["subexpr","if",[["get","showDropdown",["loc",[null,[8,120],[8,132]]]],"open"],[],["loc",[null,[8,115],[8,141]]]]]]],
        ["attribute","class",["concat",["btn dropdown-toggle ",["get","buttonClass",["loc",[null,[12,39],[12,50]]]]," ",["subexpr","if",[["get","disabled",["loc",[null,[12,58],[12,66]]]],"disabled"],[],["loc",[null,[12,53],[12,79]]]]]]],
        ["attribute","id",["get","menuButtonId",["loc",[null,[13,15],[13,27]]]]],
        ["element","action",["showHide"],[],["loc",[null,[11,10],[11,31]]]],
        ["content","selectionSummary",["loc",[null,[17,6],[17,26]]]],
        ["attribute","class",["subexpr","if",[["get","selectionBadge",["loc",[null,[18,23],[18,37]]]],"badge","caret"],[],["loc",[null,[18,18],[18,55]]]]],
        ["content","selectionBadge",["loc",[null,[18,70],[18,88]]]],
        ["attribute","aria-labelledby",["get","menuButtonId",["loc",[null,[21,58],[21,70]]]]],
        ["content","yield",["loc",[null,[23,6],[23,15]]]],
        ["block","if",[["get","liveSearch",["loc",[null,[25,10],[25,20]]]]],[],1,null,["loc",[null,[25,4],[34,11]]]],
        ["block","if",[["get","multiple",["loc",[null,[35,10],[35,18]]]]],[],2,null,["loc",[null,[35,4],[61,11]]]],
        ["block","each",[["get","nestedGroupContentList",["loc",[null,[62,12],[62,34]]]]],[],3,null,["loc",[null,[62,4],[73,13]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3]
    };
  }()));

});
define('dummy/templates/i18n', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 0
            },
            "end": {
              "line": 30,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/i18n.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=multipleContent\n                selection=multipleValue\n                multiple=true\n\n                titleTranslation=\"tranlation.key.title\"\n                selectAllTranslation=\"tranlation.key.select_all\"\n                selectNoneTranslation=\"tranlation.key.select_none\"\n                nothingSelectedMessageTranslation=\"tranlation.key.prompt\"\n\n                summaryMessageKey=\"i18n.tranlation.key.summary\"\n\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 39,
              "column": 0
            },
            "end": {
              "line": 54,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/i18n.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{\n  \"translation\": {\n    \"key: {\n      \"title\": \"translated title used for accessibility\",\n      \"prompt\": \"translated prompt\",\n      \"select_all\": \"Select All\",\n      \"select_none\": \"Select None\",\n      \"summary\": {\n        \"one\": \"You selected ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("{{item}}\",\n        \"other\": \"You selected ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("{{count}} items: ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("{{list}}\"\n      }\n    }\n  }\n}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 74,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/i18n.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("I18n Support");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("To use i18n support you first need to install the ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","https://www.npmjs.com/package/ember-i18n");
        var el5 = dom.createElement("code");
        var el6 = dom.createTextNode("ember-i18n");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" addon");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" to your applicaiton project.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("pre");
        var el4 = dom.createTextNode("$ ember install ember-i18n");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Template Example");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("JSON Strings Example");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Caveats");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Because translated properties can not have interpolated values the ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("summaryMessage");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" uses ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("summaryMessageKey");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" instead of ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("summaryMessageTranslation");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(". It has the following values:");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("dl");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("dt");
        var el5 = dom.createTextNode("count");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("dd");
        var el5 = dom.createTextNode("Number of selected items. If ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("em");
        var el6 = dom.createTextNode("zero");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" then ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("code");
        var el6 = dom.createTextNode("nothingSelectedMessage");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" is used instead.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("dt");
        var el5 = dom.createTextNode("item");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("dd");
        var el5 = dom.createTextNode("The item selected (first item in the list if multiple items are selected).");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("dt");
        var el5 = dom.createTextNode("list");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("dd");
        var el5 = dom.createTextNode("The list of selected items comma separated.");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [4, 3]),1,1);
        return morphs;
      },
      statements: [
        ["block","highlight-code",[],["lang","handlebars"],0,null,["loc",[null,[16,0],[30,19]]]],
        ["block","highlight-code",[],["lang","json"],1,null,["loc",[null,[39,0],[54,19]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('dummy/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 20,
              "column": 0
            },
            "end": {
              "line": 26,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=singleContent\n                selection=singleChoice\n                action=(action \"setSingleChoice\")\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 53,
              "column": 0
            },
            "end": {
              "line": 61,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=multipleContent\n                selection=multipleChoices\n                action=(action \"setMultipleChoices\")\n                multiple=true\n                optionGroupPath=\"group\"\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 89,
              "column": 0
            },
            "end": {
              "line": 97,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/index.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{list-picker content=listContent\n              selection=listChoices\n              action=(action \"setListChoices\")\n              multiple=\"true\"\n              optionGroupPath=\"group\"\n              optionLabelPath=\"content.label\"\n              optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 102,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Single Selection");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-12");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Results:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Multiple Selections");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-12");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Results:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("List Picker");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-12");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Results:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 3]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(fragment, [2, 3]);
        var element3 = dom.childAt(element2, [3]);
        var element4 = dom.childAt(fragment, [4, 3]);
        var element5 = dom.childAt(element4, [3]);
        var morphs = new Array(9);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1, 1]),2,2);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [1, 1]),0,0);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element2, [1, 1, 1]),2,2);
        morphs[4] = dom.createMorphAt(dom.childAt(element3, [1, 1]),0,0);
        morphs[5] = dom.createMorphAt(dom.childAt(element3, [3]),1,1);
        morphs[6] = dom.createMorphAt(dom.childAt(element4, [1, 1, 1]),2,2);
        morphs[7] = dom.createMorphAt(dom.childAt(element5, [1, 1]),0,0);
        morphs[8] = dom.createMorphAt(dom.childAt(element5, [3]),1,1);
        return morphs;
      },
      statements: [
        ["content","singleChoiceStr",["loc",[null,[8,37],[8,56]]]],
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","singleContent",["loc",[null,[13,35],[13,48]]]]],[],[]],"selection",["subexpr","@mut",[["get","singleChoice",["loc",[null,[14,37],[14,49]]]]],[],[]],"action",["subexpr","action",["setSingleChoice"],[],["loc",[null,[15,34],[15,60]]]],"optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[13,11],[17,60]]]],
        ["block","highlight-code",[],["lang","handlebars"],0,null,["loc",[null,[20,0],[26,19]]]],
        ["content","multipleChoicesStr",["loc",[null,[39,37],[39,59]]]],
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","multipleContent",["loc",[null,[44,35],[44,50]]]]],[],[]],"selection",["subexpr","@mut",[["get","multipleChoices",["loc",[null,[45,37],[45,52]]]]],[],[]],"action",["subexpr","action",["setMultipleChoices"],[],["loc",[null,[46,34],[46,63]]]],"multiple",true,"optionGroupPath","group","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[44,11],[50,60]]]],
        ["block","highlight-code",[],["lang","handlebars"],1,null,["loc",[null,[53,0],[61,19]]]],
        ["content","listChoicesStr",["loc",[null,[75,37],[75,55]]]],
        ["inline","list-picker",[],["content",["subexpr","@mut",[["get","listContent",["loc",[null,[80,33],[80,44]]]]],[],[]],"selection",["subexpr","@mut",[["get","listChoices",["loc",[null,[81,35],[81,46]]]]],[],[]],"action",["subexpr","action",["setListChoices"],[],["loc",[null,[82,32],[82,57]]]],"multiple","true","optionGroupPath","group","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[80,11],[86,58]]]],
        ["block","highlight-code",[],["lang","handlebars"],2,null,["loc",[null,[89,0],[97,19]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('dummy/templates/install', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 24,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/install.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Installing");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("This is an ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","");
        var el5 = dom.createTextNode("Ember CLI Addon");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" and can be installed through the ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("code");
        var el5 = dom.createTextNode("ember");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" command.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("pre");
        var el4 = dom.createTextNode("$ ember install ember-cli-select-picker");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Contributing");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Contributions are welcome. All source code is managed through ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","https://github.com/");
        var el5 = dom.createTextNode("GitHub");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(".");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","https://github.com/sukima/ember-cli-select-picker/");
        dom.setAttribute(el4,"class","btn btn-primary btn-lg active");
        var el5 = dom.createTextNode("\n        View source on GitHub\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() { return []; },
      statements: [

      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dummy/templates/keyboard', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 56,
              "column": 0
            },
            "end": {
              "line": 62,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/keyboard.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{keyboard-select-picker content=singleContent\n                         selection=singleChoice\n                         action=(action \"setSingleChoice\")\n                         optionLabelPath=\"content.label\"\n                         optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 89,
              "column": 0
            },
            "end": {
              "line": 97,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/keyboard.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{keyboard-select-picker content=multipleContent\n                         selection=multipleChoices\n                         action=(action \"setMultipleChoices\")\n                         multiple=true\n                         optionGroupPath=\"group\"\n                         optionLabelPath=\"content.label\"\n                         optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 102,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/keyboard.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Keyboard Support");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("To use keyboard support you first need to install the ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4,"href","https://www.npmjs.com/package/ember-keyboard-shortcuts");
        var el5 = dom.createElement("code");
        var el6 = dom.createTextNode("ember-keyboard-shortcuts");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" addon");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode(" to your applicaiton project.");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("pre");
        var el4 = dom.createTextNode("$ ember install ember-keyboard-shortcuts");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("table");
        dom.setAttribute(el2,"class","table table-condensed");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("thead");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        var el6 = dom.createTextNode("Key");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("th");
        var el6 = dom.createTextNode("Action");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tbody");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createElement("kbd");
        var el7 = dom.createTextNode("Esc");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createTextNode("Close the dropdown list");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createElement("kbd");
        var el7 = dom.createTextNode("Enter");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createTextNode("Open the dropdown list ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("em");
        var el7 = dom.createTextNode("or");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" Select/Unselect item the cursor is on");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createElement("kbd");
        var el7 = dom.createTextNode("Down");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createTextNode("Move cursor to ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("next");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" item");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("tr");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createElement("kbd");
        var el7 = dom.createTextNode("Up");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("td");
        var el6 = dom.createTextNode("Move cursor to ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("previous");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" item");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Single Selection");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-12");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Results:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Multiple Selections");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-12");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Results:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2, 3]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(fragment, [4, 3]);
        var element3 = dom.childAt(element2, [3]);
        var morphs = new Array(6);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1, 1]),2,2);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element2, [1, 1, 1]),2,2);
        morphs[4] = dom.createMorphAt(dom.childAt(element3, [1]),1,1);
        morphs[5] = dom.createMorphAt(dom.childAt(element3, [3]),1,1);
        return morphs;
      },
      statements: [
        ["content","singleChoiceStr",["loc",[null,[44,37],[44,56]]]],
        ["inline","keyboard-select-picker",[],["content",["subexpr","@mut",[["get","singleContent",["loc",[null,[49,41],[49,54]]]]],[],[]],"selection",["subexpr","@mut",[["get","singleChoice",["loc",[null,[50,43],[50,55]]]]],[],[]],"action",["subexpr","action",["setSingleChoice"],[],["loc",[null,[51,40],[51,66]]]],"optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[49,8],[53,66]]]],
        ["block","highlight-code",[],["lang","handlebars"],0,null,["loc",[null,[56,0],[62,19]]]],
        ["content","multipleChoicesStr",["loc",[null,[75,37],[75,59]]]],
        ["inline","keyboard-select-picker",[],["content",["subexpr","@mut",[["get","multipleContent",["loc",[null,[80,41],[80,56]]]]],[],[]],"selection",["subexpr","@mut",[["get","multipleChoices",["loc",[null,[81,43],[81,58]]]]],[],[]],"action",["subexpr","action",["setMultipleChoices"],[],["loc",[null,[82,40],[82,69]]]],"multiple",true,"optionGroupPath","group","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[80,8],[86,66]]]],
        ["block","highlight-code",[],["lang","handlebars"],1,null,["loc",[null,[89,0],[97,19]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('dummy/templates/options', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 23,
              "column": 0
            },
            "end": {
              "line": 32,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/options.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=multipleContent\n                selection=multipleChoices\n                action=(action \"setMultipleChoices\")\n                multiple=true\n                showBadge=true\n                summaryMessage=\"Multiple items selected\"\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 60,
              "column": 0
            },
            "end": {
              "line": 68,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/options.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=multipleContent\n                selection=multipleChoices\n                action=(action \"setMultipleChoices\")\n                multiple=true\n                nativeMobile=false\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 87,
              "column": 11
            },
            "end": {
              "line": 97,
              "column": 8
            }
          },
          "moduleName": "dummy/templates/options.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","alert alert-info clearfix");
          var el2 = dom.createTextNode("\n            Hello! Try this: ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2,"class","btn btn-sm btn-primary");
          var el3 = dom.createTextNode("button");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1, 1]);
          var morphs = new Array(1);
          morphs[0] = dom.createElementMorph(element0);
          return morphs;
        },
        statements: [
          ["element","action",["showHelloDialog"],[],["loc",[null,[95,68],[95,96]]]]
        ],
        locals: [],
        templates: []
      };
    }());
    var child3 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 100,
              "column": 0
            },
            "end": {
              "line": 112,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/options.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{#select-picker content=multipleContent\n                 selection=multipleChoices\n                 action=(action \"setMultipleChoices\")\n                 multiple=true\n                 summaryMessage=\"Example content inside\"\n                 optionLabelPath=\"content.label\"\n                 optionValuePath=\"content.value\"}}\n  <div class=\"alert alert-info\">\n    Hello! Try this <button ");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("{{action \"showHelloDialog\"}}>button</button>\n  </div>\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("{{/select-picker}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child4 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 118,
              "column": 0
            },
            "end": {
              "line": 120,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/options.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          var el2 = dom.createTextNode("Hello random user!");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 121,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/options.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Badges");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-12");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Results:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Mobile Support");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-12");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("By default the native select widget is used for small screens (mobile) If you want the Bootstrap styled picker on mobile devices then you need to set ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("code");
        var el7 = dom.createTextNode("nativeMobile");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" to ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("em");
        var el7 = dom.createTextNode("false");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(".");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Results:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Custom content");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-12");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("You can add your own custom content to the top of the drop down by using Ember's block syntax.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Results:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [0, 3]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(fragment, [2, 3]);
        var element4 = dom.childAt(element3, [3]);
        var element5 = dom.childAt(fragment, [4, 3]);
        var element6 = dom.childAt(element5, [3]);
        var morphs = new Array(10);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1, 1, 1]),2,2);
        morphs[1] = dom.createMorphAt(dom.childAt(element2, [1, 1]),0,0);
        morphs[2] = dom.createMorphAt(dom.childAt(element2, [3]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element3, [1, 1, 3]),2,2);
        morphs[4] = dom.createMorphAt(dom.childAt(element4, [1, 1]),0,0);
        morphs[5] = dom.createMorphAt(dom.childAt(element4, [3]),1,1);
        morphs[6] = dom.createMorphAt(dom.childAt(element5, [1, 1, 3]),2,2);
        morphs[7] = dom.createMorphAt(dom.childAt(element6, [1, 1]),0,0);
        morphs[8] = dom.createMorphAt(dom.childAt(element6, [3]),1,1);
        morphs[9] = dom.createMorphAt(fragment,6,6,contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["content","multipleChoicesStr",["loc",[null,[8,37],[8,59]]]],
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","multipleContent",["loc",[null,[13,35],[13,50]]]]],[],[]],"selection",["subexpr","@mut",[["get","multipleChoices",["loc",[null,[14,37],[14,52]]]]],[],[]],"action",["subexpr","action",["setMultipleChoices"],[],["loc",[null,[15,34],[15,63]]]],"multiple",true,"showBadge",true,"summaryMessage","Multiple items selected","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[13,11],[20,60]]]],
        ["block","highlight-code",[],["lang","handlebars"],0,null,["loc",[null,[23,0],[32,19]]]],
        ["content","multipleChoicesStr",["loc",[null,[46,37],[46,59]]]],
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","multipleContent",["loc",[null,[51,35],[51,50]]]]],[],[]],"selection",["subexpr","@mut",[["get","multipleChoices",["loc",[null,[52,37],[52,52]]]]],[],[]],"action",["subexpr","action",["setMultipleChoices"],[],["loc",[null,[53,34],[53,63]]]],"multiple",true,"nativeMobile",false,"optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[51,11],[57,60]]]],
        ["block","highlight-code",[],["lang","handlebars"],1,null,["loc",[null,[60,0],[68,19]]]],
        ["content","multipleChoicesStr",["loc",[null,[82,37],[82,59]]]],
        ["block","select-picker",[],["content",["subexpr","@mut",[["get","multipleContent",["loc",[null,[87,36],[87,51]]]]],[],[]],"selection",["subexpr","@mut",[["get","multipleChoices",["loc",[null,[88,38],[88,53]]]]],[],[]],"action",["subexpr","action",["setMultipleChoices"],[],["loc",[null,[89,35],[89,64]]]],"multiple",true,"summaryMessage","Example content inside","optionLabelPath","content.label","optionValuePath","content.value"],2,null,["loc",[null,[87,11],[97,26]]]],
        ["block","highlight-code",[],["lang","handlebars"],3,null,["loc",[null,[100,0],[112,19]]]],
        ["block","modal-dialog",[],["title","Hello User","isVisible",["subexpr","@mut",[["get","showHelloDialog",["loc",[null,[118,45],[118,60]]]]],[],[]],"onDismiss",["subexpr","action",["hideHelloDialog"],[],["loc",[null,[118,71],[118,97]]]]],4,null,["loc",[null,[118,0],[120,17]]]]
      ],
      locals: [],
      templates: [child0, child1, child2, child3, child4]
    };
  }()));

});
define('dummy/templates/searching', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 25,
              "column": 0
            },
            "end": {
              "line": 34,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/searching.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=simpleSearchContent\n                selection=simpleSearchChoices\n                action=(action \"setSimpleSearchChoices\")\n                multiple=true\n                liveSearch=true\n                optionGroupPath=\"group\"\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child1 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 64,
              "column": 0
            },
            "end": {
              "line": 73,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/searching.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{select-picker content=advancedSearchContent\n                selection=advancedSearchChoices\n                action=(action \"setAdvancedSearchChoices\")\n                multiple=true\n                liveSearch=\"advanced\"\n                optionGroupPath=\"group\"\n                optionLabelPath=\"content.label\"\n                optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    var child2 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.8",
          "loc": {
            "source": null,
            "start": {
              "line": 101,
              "column": 0
            },
            "end": {
              "line": 110,
              "column": 0
            }
          },
          "moduleName": "dummy/templates/searching.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("{{list-picker content=advancedSearchContent\n              selection=listSearchChoices\n              action=(action \"setListSearchChoices\")\n              multiple=true\n              liveSearch=\"advanced\"\n              optionGroupPath=\"group\"\n              optionLabelPath=\"content.label\"\n              optionValuePath=\"content.value\"}}\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() { return []; },
        statements: [

        ],
        locals: [],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 115,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/searching.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Single Search");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-12");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        dom.setAttribute(el5,"class","search-examples");
        var el6 = dom.createTextNode("Simple search attempts to match terms as full strings.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("For example the term ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("code");
        var el7 = dom.createTextNode("def");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" would match the words ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("code");
        var el7 = dom.createTextNode("abc");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("u");
        var el8 = dom.createTextNode("def");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(", ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("code");
        var el7 = dom.createElement("u");
        var el8 = dom.createTextNode("def");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("ghi");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(", or ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("code");
        var el7 = dom.createTextNode("in");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("u");
        var el8 = dom.createTextNode("def");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("initely");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(".");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Result:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("Advanced Search");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-12");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        dom.setAttribute(el5,"class","search-examples");
        var el6 = dom.createTextNode("Advanced search finds terms through a fuzzy match. It looks for characters in the string that appear in order from left to right with any number of other character in between.");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createTextNode("For example the search term ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("code");
        var el7 = dom.createTextNode("def");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" would match ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("code");
        var el7 = dom.createTextNode("abc");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("u");
        var el8 = dom.createTextNode("def");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" or ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("code");
        var el7 = dom.createElement("u");
        var el8 = dom.createTextNode("d");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("iv");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("u");
        var el8 = dom.createTextNode("e");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("rsi");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("u");
        var el8 = dom.createTextNode("f");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("y");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(".");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Result:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","panel panel-default");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-heading");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3,"class","panel-title");
        var el4 = dom.createTextNode("List Picker");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","panel-body");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-12");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("p");
        var el6 = dom.createElement("strong");
        var el7 = dom.createTextNode("Result:");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode(" ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-4");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4,"class","col-sm-8");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 3]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(fragment, [2, 3]);
        var element3 = dom.childAt(element2, [3]);
        var element4 = dom.childAt(fragment, [4, 3]);
        var element5 = dom.childAt(element4, [3]);
        var morphs = new Array(9);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1, 5]),2,2);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [1]),1,1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [3]),1,1);
        morphs[3] = dom.createMorphAt(dom.childAt(element2, [1, 1, 5]),2,2);
        morphs[4] = dom.createMorphAt(dom.childAt(element3, [1]),1,1);
        morphs[5] = dom.createMorphAt(dom.childAt(element3, [3]),1,1);
        morphs[6] = dom.createMorphAt(dom.childAt(element4, [1, 1, 1]),2,2);
        morphs[7] = dom.createMorphAt(dom.childAt(element5, [1]),1,1);
        morphs[8] = dom.createMorphAt(dom.childAt(element5, [3]),1,1);
        return morphs;
      },
      statements: [
        ["content","simpleSearchChoicesStr",["loc",[null,[10,36],[10,62]]]],
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","simpleSearchContent",["loc",[null,[15,32],[15,51]]]]],[],[]],"selection",["subexpr","@mut",[["get","simpleSearchChoices",["loc",[null,[16,34],[16,53]]]]],[],[]],"action",["subexpr","action",["setSimpleSearchChoices"],[],["loc",[null,[17,31],[17,64]]]],"multiple",true,"liveSearch",true,"optionGroupPath","group","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[15,8],[22,57]]]],
        ["block","highlight-code",[],["lang","handlebars"],0,null,["loc",[null,[25,0],[34,19]]]],
        ["content","advancedSearchChoicesStr",["loc",[null,[49,36],[49,64]]]],
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","advancedSearchContent",["loc",[null,[54,32],[54,53]]]]],[],[]],"selection",["subexpr","@mut",[["get","advancedSearchChoices",["loc",[null,[55,34],[55,55]]]]],[],[]],"action",["subexpr","action",["setAdvancedSearchChoices"],[],["loc",[null,[56,31],[56,66]]]],"multiple",true,"liveSearch","advanced","optionGroupPath","group","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[54,8],[61,57]]]],
        ["block","highlight-code",[],["lang","handlebars"],1,null,["loc",[null,[64,0],[73,19]]]],
        ["content","listSearchChoicesStr",["loc",[null,[86,36],[86,60]]]],
        ["inline","list-picker",[],["content",["subexpr","@mut",[["get","listSearchContent",["loc",[null,[91,30],[91,47]]]]],[],[]],"selection",["subexpr","@mut",[["get","listSearchChoices",["loc",[null,[92,32],[92,49]]]]],[],[]],"action",["subexpr","action",["setListSearchChoices"],[],["loc",[null,[93,29],[93,60]]]],"multiple",true,"liveSearch","advanced","optionGroupPath","group","optionLabelPath","content.label","optionValuePath","content.value"],["loc",[null,[91,8],[98,55]]]],
        ["block","highlight-code",[],["lang","handlebars"],2,null,["loc",[null,[101,0],[110,19]]]]
      ],
      locals: [],
      templates: [child0, child1, child2]
    };
  }()));

});
define('dummy/templates/test-list-picker', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/test-list-picker.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("list-picker");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","single-picker");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","multiple-picker");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [4]),1,1);
        return morphs;
      },
      statements: [
        ["inline","list-picker",[],["content",["subexpr","@mut",[["get","theContent",["loc",[null,[4,24],[4,34]]]]],[],[]],"value",["subexpr","@mut",[["get","singleValue",["loc",[null,[5,22],[5,33]]]]],[],[]],"nativeMobile",false,"optionLabelPath","content.name","optionValuePath","content.id"],["loc",[null,[4,2],[8,46]]]],
        ["inline","list-picker",[],["content",["subexpr","@mut",[["get","theContent",["loc",[null,[12,24],[12,34]]]]],[],[]],"selection",["subexpr","@mut",[["get","multipleValue",["loc",[null,[13,26],[13,39]]]]],[],[]],"multiple",true,"nativeMobile",false,"optionLabelPath","content.name","optionValuePath","content.id"],["loc",[null,[12,2],[17,46]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('dummy/templates/test-select-picker', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.8",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 40,
            "column": 0
          }
        },
        "moduleName": "dummy/templates/test-select-picker.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("select-picker");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","single-picker");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","multiple-picker");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","normal-search-picker");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"id","advanced-search-picker");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2]),1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(fragment, [4]),1,1);
        return morphs;
      },
      statements: [
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","theContent",["loc",[null,[4,26],[4,36]]]]],[],[]],"value",["subexpr","@mut",[["get","singleValue",["loc",[null,[5,24],[5,35]]]]],[],[]],"nativeMobile",false,"optionLabelPath","content.name","optionValuePath","content.id"],["loc",[null,[4,2],[8,48]]]],
        ["inline","select-picker",[],["content",["subexpr","@mut",[["get","theContent",["loc",[null,[12,26],[12,36]]]]],[],[]],"selection",["subexpr","@mut",[["get","multipleValue",["loc",[null,[13,28],[13,41]]]]],[],[]],"multiple",true,"showBadge",true,"nativeMobile",false,"optionLabelPath","content.name","optionValuePath","content.id"],["loc",[null,[12,2],[18,48]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('dummy/config/environment', ['ember'], function(Ember) {
  var prefix = 'dummy';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("dummy/tests/test-helper");
} else {
  require("dummy/app")["default"].create({"addonVersion":"2.3.2","name":"ember-cli-select-picker","version":"2.3.2+9b1b71e9"});
}

/* jshint ignore:end */
