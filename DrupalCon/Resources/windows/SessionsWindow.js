/*
 * This is the page of session listings.
 */
(function() {

  // Pre-compute this list once, since it's not going to change in one run
  // of the program (presumably).
  var presenterList = {};
  function getPresenterList() {
    if (!Object.keys(presenterList).length) {
      var rows = Drupal.db.getConnection('main').query('SELECT name, full_name FROM user');
      while (rows.isValidRow()) {
        presenterList[rows.fieldByName('name')] = rows.fieldByName('full_name');
        rows.next();
      }
    }
    return presenterList;
  }

  // Clear the presenter list cache when we update data.
  Ti.addEventListener('drupal:entity:datastore:update_completed', function(e) {
    presenterList= {};
  });

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
      var sessionTitle = cleanSpecialChars(session.title);

      var sessionRow = Ti.UI.createTableViewRow({
        hasChild: true,
        selectedColor: '#fff',
        backgroundColor: '#fff',
        color: '#000',
        className: 'session-row',
        start_date: session.start_date,
        end_date: session.end_date,
        nid: session.nid,
        sessionTitle: sessionTitle,
        height: 'auto',
        layout: 'vertical'
      });

      // If there is a new session time, insert a header in the table.
      if (lastTime == '' || session.start_date != lastTime) {
        lastTime = session.start_date;
        sessionRow.header = cleanTime(lastTime) + " - " + cleanTime(session.end_date);
      }

      sessionRow.add(Ti.UI.createLabel({
        text: sessionTitle,
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
      var presenters = getPresenterList();
      var instructorList = [];
      if (typeof session.instructors == 'string') {
        instructorList.push(session.instructors);
      }
      else {
        for (var i in session.instructors) {
          instructorList.push(presenters[session.instructors[i]]);
        }
      }
      sessionRow.add(Ti.UI.createLabel({
        text: instructorList.join(', '),
        font: {fontSize:10, fontWeight:'normal'},
        left: 10,
        top: 'auto',
        bottom: 10,
        right: 10,
        height: 'auto'
      }));

      // Some things, like keynote, have multiple rooms
      var rooms = [];
      if (typeof session.room === 'string') {
        rooms.push(session.room);
      }
      else {
        // Force what is likely an object to an array.
        for (var r in session.room) {
          rooms.push(session.room[r]);
        }
      }
      sessionRow.add(Ti.UI.createLabel({
        text: rooms.map(cleanSpecialChars).join(', '),
        font: {fontSize:12, fontWeight:'bold'},
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
      data.push(renderSession(sessions[sessionNum]));
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

