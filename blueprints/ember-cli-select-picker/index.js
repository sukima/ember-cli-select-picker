/* jshint node: true */
module.exports = {
  // no-op since we're just adding dependencies
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackagesToProject([
      {name: 'bootstrap', target: '~3.3.4'}
    ]);
  }
};
