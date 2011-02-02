(function() {

  var rootPath = '../../../../../../../../../../';
  Ti.include(
    rootPath+"drupal/drupal.js",
    rootPath+"drupal/services.js",
    rootPath+"drupal/db.js",
    rootPath+"drupal/entity.js"
  );

  Ti.API.info('Start of session.js: ');

  var win = Titanium.UI.currentWindow;
  var conn = Drupal.db.getConnection('main');
  var rows = conn.query("SELECT * FROM node WHERE nid = ?", [win.nid]);
  while (rows.isValidRow()) {
    var data = JSON.parse(rows.fieldByName('data'));

    Ti.API.info(data);
    textArea = Ti.UI.createTextArea({
      title: rows.fieldByName('title'),
      value: data.body
    });
    // This was to help me figure out the db structure
//    var count = rows.fieldCount();
//    Ti.API.info("Count is " + count);
//    var row = 0;
//    while (row <= count) {
//      row++;
//      alert(row);
//      Ti.API.info(rows.fieldName(row));
//    }

    rows.next();
  }
  rows.close();
  Ti.API.info(textArea);

  win.add(textArea);
})();
