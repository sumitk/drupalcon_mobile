
(function() {

  DrupalCon.ui.createSessionsWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      start_date: '',
      end_date: '',
      tabGroup: undefined
    });
  
    var sessionsWindow = Titanium.UI.createWindow({
      id: 'sessionsWindow',
      title: 'Sessions',
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    var lastTime = '';
    var data = [];

    var conn = Drupal.db.getConnection('main');
    var rows = conn.query("SELECT nid, title, changed, start_date, end_date FROM node WHERE start_date >= ? AND end_date <= ? ORDER BY start_date, nid", [settings.start_date, settings.end_date]);

    while (rows.isValidRow()) {
      // If it is a new time, start a new section.
      if (lastTime == '' || rows.fieldByName('start_date') != lastTime) {
        lastTime = rows.fieldByName('start_date');
        data.push({
          title: cleanTime(lastTime) + " - " + cleanTime(rows.fieldByName('end_date')),
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
        backgroundColor: '#fff',
        color: '#000',
        start_date: rows.fieldByName('start_date'),
        end_date: rows.fieldByName('end_date'),
        nid: rows.fieldByName('nid')
      });
      //Titanium.API.info('Nid: ' + rows.fieldByName('nid') + ', Start: ' + rows.fieldByName('start_date') + ', End: ' + rows.fieldByName('end_date')  + ', Changed: ' + rows.fieldByName('changed') + ', Title: ' + rows.fieldByName('title'));
      rows.next();
    }
    rows.close();
    // Ti.API.info(data);


    // create table view
    var tableview = Titanium.UI.createTableView({
      data: data,
      backgroundColor: '#fff'
    });

    // create table view event listener
    tableview.addEventListener('click', function(e) {
      if (Ti.Platform.name == 'android') {
        var currentTab = Titanium.UI.currentTab;
      }
      else {
        var currentTab = sessionsWindow.tabGroup.activeTab;
      }
      currentTab.open(DrupalCon.ui.createSessionDetailWindow({
        title: e.rowData.title,
        nid: e.rowData.nid,
        tabGroup: Titanium.UI.currentTab
      }), {animated:true});
    });

    // add table view to the window
    sessionsWindow.add(tableview);


    return sessionsWindow;
  };

})();

