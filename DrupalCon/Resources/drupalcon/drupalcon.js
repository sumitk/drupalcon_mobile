
var DrupalCon = {
  ui: {},
  util: {}
};

(function() {

  var presenterList = {};

  DrupalCon.util.getPresenterList = function() {
    if (!Object.keys(presenterList).length) {
        var rows = Drupal.db.getConnection('main').query('SELECT name, full_name FROM user');
        while (rows.isValidRow()) {
          presenterList[rows.fieldByName('name')] = rows.fieldByName('full_name');
          rows.next();
        }
      }
      return presenterList;
  };

  DrupalCon.util.getPresenterName = function(name) {
    var list = DrupalCon.util.getPresenterList();
    return list[name] || '';
  }

  // Clear the presenter list cache when we update data.
  Ti.addEventListener('drupal:entity:datastore:update_completed', function(e) {
    presenterList = {};
  });

})();
