
(function() {
  var rootPath = '../../../../../../../../../../';
  Ti.include(
    rootPath+"drupal/drupal.js",
    rootPath+"drupal/services.js",
    rootPath+"drupal/db.js",
    rootPath+"drupal/entity.js"
  );


  Ti.API.info('Start of sessions.js: ' + Drupal.getObjectProperties(Drupal.db.connectionInfo));

  var win = Titanium.UI.currentWindow;

  var data = [];
  var conn = Drupal.db.getConnection('main');
  var rows = conn.query("SELECT nid, title, changed, start_date, end_date FROM node WHERE start_date >= ? AND end_date <= ? ORDER BY nid, changed", [win.start_date, win.end_date]);

  while (rows.isValidRow()) {
    data.push({
      title: rows.fieldByName('title'),
      hasChild: true,
      selectedColor: '#fff',
      start_date: rows.fieldByName('start_date'),
      end_date: rows.fieldByName('end_date')
    });
    Titanium.API.info('Nid: ' + rows.fieldByName('nid') + ', Start: ' + rows.fieldByName('start_date') + ', End: ' + rows.fieldByName('end_date')  + ', Changed: ' + rows.fieldByName('changed') + ', Title: ' + rows.fieldByName('title'));
    rows.next();
  }
  rows.close();

  // create table view
  var tableview = Titanium.UI.createTableView({
    data: data
  });



/*
  // create table view event listener
  tableview.addEventListener('click', function(e) {
    Ti.API.info(e.rowData);
    // event data
    var index = e.index+1;
    var date = e.rowData.date;
    Ti.API.info('detail ' + e.rowData.date);
    var win = Titanium.UI.createWindow({
      url: 'sessions.js',
      title: e.rowData.title,
      date: date
    });

    Titanium.UI.currentTab.open(win,{animated:true});
  });
*/

  // add table view to the window
  win.add(tableview);

})();