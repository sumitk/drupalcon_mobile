/*
 * This is the page of session listings.
 */
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

    var nids = [];
    while(rows.isValidRow()) {
      nids.push(rows.fieldByName('nid'));
      rows.next();
    }
    rows.close();

    function renderSession(session) {
      var sessionRow = Ti.UI.createTableViewRow({
        hasChild: true,
        selectedColor: '#fff',
        backgroundColor: '#fff',
        color: '#000',
        className: 'session-row',
        start_date: session.start_date,
        end_date: session.end_date,
        nid: session.nid,
        sessionTitle: cleanSpecialChars(session.title),
        height: 'auto',
        layout: 'vertical'
      });

      // If there is a new session time, insert a header in the table.
      if (lastTime == '' || session.start_date != lastTime) {
        lastTime = session.start_date;
        sessionRow.header = cleanTime(lastTime) + " - " + cleanTime(session.end_date);
      }

      sessionRow.add(Ti.UI.createLabel({
        text: cleanSpecialChars(session.title),
        font: {fontSize:18, fontWeight:'bold'},
        left: 10,
        top: 10,
        right: 10,
        height: 'auto'
      }));

      sessionRow.add(Ti.UI.createLabel({
        text: session.track + " track",
        font: {fontSize:12, fontWeight:'bold'},
        left: 10,
        right: 10,
        height: 'auto'
      }));

      // Some sessions have multiple presenters
      sessionRow.add(Ti.UI.createLabel({
        text: getPresenterData(session.instructors).join(', '),
        font: {fontSize:10, fontWeight:'normal'},
        left: 10,
        top: 'auto',
        bottom: 10,
        right: 10,
        height: 'auto'
      }));

      // Some things, like keynote, have multiple rooms
      var room = [];
      if (typeof session.room === 'string') {
        room.push(session.room);
      }
      else {
        room = session.room;
      }
      var roomNames = '';
      for(var i in room) {
        roomNames += cleanSpecialChars(room[i]) + ', ';
      }
      roomNames = roomNames.slice(0, roomNames.length-2)
      sessionRow.add(Ti.UI.createLabel({
        text:roomNames,
        font:{fontSize:12, fontWeight:'bold'},
        left: 10,
        top: 'auto',
        bottom: 10,
        right: 10,
        height: 'auto'
      }));

      return sessionRow;
    }

    var sessions = Drupal.entity.db('main', 'node').loadMultiple(nids, ['start_date', 'nid']);

    for (var sessionNum = 0, numSessions = sessions.length; sessionNum < numSessions; sessionNum++) {
      sessionRow = renderSession(sessions[sessionNum]);
      data.push(sessionRow);
    }

    // create table view
    var tableview = Titanium.UI.createTableView({
      data: data,
      backgroundColor: '#fff'
    });

    // create table view event listener
    tableview.addEventListener('click', function(e) {
      var currentTab = (Ti.Platform.name == 'android') ? currentTab = Titanium.UI.currentTab : sessionsWindow.tabGroup.activeTab;
      currentTab.open(DrupalCon.ui.createSessionDetailWindow({
        title: e.rowData.sessionTitle,
        nid: e.rowData.nid,
        tabGroup: Titanium.UI.currentTab
      }), {animated:true});
    });

    // add table view to the window
    sessionsWindow.add(tableview);


    return sessionsWindow;
  };

})();

