/*
 * This is the page of session listings.
 */
(function() {

  var lastTime = '';
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
      title: 'Sessions',
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    var data = [];

    var conn = Drupal.db.getConnection('main');
    var rows = conn.query("SELECT nid, title, changed, start_date, end_date FROM node WHERE start_date >= ? AND end_date <= ? ORDER BY start_date, nid", [settings.start_date, settings.end_date]);

    var nids = [];
    while(rows.isValidRow()) {
      nids.push(rows.fieldByName('nid'));
      rows.next();
    }
    rows.close();

    var sessions = Drupal.entity.db('main', 'node').loadMultiple(nids, ['start_date', 'nid']);

    for (var sessionNum = 0, numSessions = sessions.length; sessionNum < numSessions; sessionNum++) {
      data.push(renderSession(sessions[sessionNum]));
    }

    // create table view
    var tableview = Titanium.UI.createTableView({
      data: data,
      backgroundColor: '#fff'
    });

    sessionsWindow.addEventListener('focus', function() {
      uiEnabled = true;
    });

    // create table view event listener
    tableview.addEventListener('click', function(e) {
      if (uiEnabled) {
        uiEnabled = false;
        var currentTab = (Ti.Platform.name == 'android') ? currentTab = Titanium.UI.currentTab : sessionsWindow.tabGroup.activeTab;
        currentTab.open(DrupalCon.ui.createSessionDetailWindow({
          title: e.rowData.sessionTitle,
          nid: e.rowData.nid,
          tabGroup: Titanium.UI.currentTab
        }), {animated:true});
      }
    });

    // add table view to the window
    sessionsWindow.add(tableview);

    return sessionsWindow;
  };

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
      layout: 'auto'
    });

    // If there is a new session time, insert a header in the table.
    if (lastTime == '' || session.start_date != lastTime) {
      lastTime = session.start_date;
      sessionRow.header = cleanTime(lastTime) + " - " + cleanTime(session.end_date);
    }

    var titleLabel = Ti.UI.createLabel({
      text: sessionTitle,
      font: {fontSize:18, fontWeight:'bold'},
      color: '#000',
      left: 10,
      top: 10,
      right: 10,
      height: 'auto'
    });
    sessionRow.add(titleLabel);

//      sessionRow.add(Ti.UI.createLabel({
//        text: session.track + " track",
//        font: {fontSize:12, fontWeight:'bold'},
//        left: 10,
//        right: 10,
//        height: 'auto'
//      }));

    // Some sessions have multiple presenters
    var presLabel = Ti.UI.createLabel({
      text: session.instructors.map(DrupalCon.util.getPresenterName).join(', '),
      font: {fontSize:10, fontWeight:'normal'},
      color: '#000',
      left: 10,
      top: titleLabel.toImage().height+10,
      bottom: 10,
      right: 10,
      height: 'auto'
    });
    sessionRow.add(presLabel);

    // Some things, like keynote, have multiple rooms
    var roomLabel = Ti.UI.createLabel({
      text: session.room.map(cleanSpecialChars).join(', '),
      font: {fontSize:12, fontWeight:'bold'},
      color: '#000',
      left: 10,
      top: titleLabel.toImage().height+10+presLabel.toImage().height+10,
      bottom: 10,
      right: 10,
      height: 'auto'
    });
    dpm("Title toImage height: " + titleLabel.toImage().height + "presLabel: " +presLabel.toImage().height );
    sessionRow.add(roomLabel);

    return sessionRow;
  }

})();

