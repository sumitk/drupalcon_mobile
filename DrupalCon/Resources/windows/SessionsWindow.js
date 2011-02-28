/*
 * This is the page of session listings.
 */
(function() {

  var uiEnabled = true;

  DrupalCon.ui.createSessionsWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      start_date: '',
      end_date: '',
      tabGroup: undefined
    });

    var sessionsWindow = Titanium.UI.createWindow({
      id: 'sessionsWindow',
      title: 'Schedule',
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    var data = [];

    var conn = Drupal.db.getConnection('main');
    var rows = conn.query("SELECT nid FROM node WHERE start_date >= ? AND end_date <= ? ORDER BY start_date, nid", [settings.start_date, settings.end_date]);

    var nids = [];
    while(rows.isValidRow()) {
      nids.push(rows.fieldByName('nid'));
      rows.next();
    }
    rows.close();

    var sessions = Drupal.entity.db('main', 'node').loadMultiple(nids, ['start_date', 'nid']);

    for (var sessionNum = 0, numSessions = sessions.length; sessionNum < numSessions; sessionNum++) {
      if (DrupalCon.renderers[sessions[sessionNum].type]) {
        data.push(DrupalCon.renderers[sessions[sessionNum].type](sessions[sessionNum]));
      }
      else {
        Ti.API.info('Not rendering for node type: ' + sessions[sessionNum].type);
      }
    }

    // create table view
    var tableview = Titanium.UI.createTableView({
      data: data,
      backgroundColor: '#fff',
      layout:'vertical'
    });

    sessionsWindow.addEventListener('focus', function() {
      uiEnabled = true;
    });

    // Create table view event listener.
    tableview.addEventListener('click', function(e) {
      if (uiEnabled) {
        uiEnabled = false;
        var currentTab = (Ti.Platform.name == 'android') ? currentTab = Titanium.UI.currentTab : sessionsWindow.tabGroup.activeTab;
        currentTab.open(DrupalCon.ui.createSessionDetailWindow({
          title: e.rowData.sessionTitle,
          nid: e.rowData.nid,
          tabGroup: currentTab
        }), {animated:true});
      }
    });

    // add table view to the window
    sessionsWindow.add(tableview);

    return sessionsWindow;
  };

})();

