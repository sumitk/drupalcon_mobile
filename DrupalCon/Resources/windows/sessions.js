
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
  var lastTime = '';
  var data = [];

  var conn = Drupal.db.getConnection('main');
  var rows = conn.query("SELECT nid, title, changed, start_date, end_date FROM node WHERE start_date >= ? AND end_date <= ? ORDER BY start_date, nid", [win.start_date, win.end_date]);

  while (rows.isValidRow()) {
    // If it is a new time, start a new section.
    if (lastTime == '' || rows.fieldByName('start_date') != lastTime) {
      lastTime = rows.fieldByName('start_date');
      data.push({
        title: lastTime.substr(11,8),
        hasChild: false,
        backgroundColor:'#7187A4',
        color:'#fff',
        height:20
      })
    }
    data.push({
      title: rows.fieldByName('title'),
      hasChild: true,
      selectedColor: '#fff',
      start_date: rows.fieldByName('start_date'),
      end_date: rows.fieldByName('end_date'),
      nid: rows.fieldByName('nid')
    });
    //Titanium.API.info('Nid: ' + rows.fieldByName('nid') + ', Start: ' + rows.fieldByName('start_date') + ', End: ' + rows.fieldByName('end_date')  + ', Changed: ' + rows.fieldByName('changed') + ', Title: ' + rows.fieldByName('title'));
    rows.next();
  }
  rows.close();
  Ti.API.info(data);
  

  // create table view
  var tableview = Titanium.UI.createTableView({
    data: data
  });

  // create table view event listener
  tableview.addEventListener('click', function(e) {
    // event data
    var index = e.index + 1;
    var start_date = e.rowData.start_date;
    var end_date = e.rowData.end_date;
    var win = Titanium.UI.createWindow({
      url: 'session.js',
      title: e.rowData.title + ' ' + e.rowData.nid,
      nid:e.rowData.nid
    });
    Titanium.UI.currentTab.open(win, {animated:true});
  });

  // add table view to the window
  win.add(tableview);

})();