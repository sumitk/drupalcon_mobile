(function() {

  var rootPath = '../../../../../../../../../../';
  Ti.include(
    rootPath+"drupal/drupal.js",
    rootPath+"drupal/services.js",
    rootPath+"drupal/db.js",
    rootPath+"drupal/entity.js",
    rootPath+"lib/platforms.js",
    rootPath+"lib/misc.js"
  );
  alert("in session");
  Ti.API.info('Start of session.js: ');

  var win = Titanium.UI.currentWindow;

  // Build session data
  var conn = Drupal.db.getConnection('main');
  var session = conn.query("SELECT data,nid FROM node WHERE nid = ?", [win.nid]);
  while (session.isValidRow()) {
    var sessionData = JSON.parse(session.fieldByName('data'));
    session.next();
  }
  session.close();
  dpm(sessionData);
  // Build presenter data
  var presenterData = [];
  var sessionInstructors = sessionData.instructors;
  // Instructors may be single (string) or multiple (object), this part works.
  var type = typeof sessionInstructors;
  if (type === 'string') {
    var instructors = [];
    instructors.push(sessionInstructors);
  } 
  else {
    var instructors = sessionInstructors;
  }
  
  for(var i in instructors) {
    dpm(instructors[i]); // returns 'emmajane' 8 letters
    conn = Drupal.db.getConnection('main');
    var rows = conn.query("SELECT uid,name,full_name FROM user WHERE name = ?", [instructors[i]]);
      // above line causes invalid parameter count (expected 1, but 8 were provided)'
    while (rows.isValidRow()) {
      presenterData.push({
        'fullName':rows.fieldByName('full_name'),
        'uid':rows.fieldByName('uid')
      })
      rows.next();
    }
    rows.close();
  }

  // Build the page:
  var tvData = [];
  var tv = Ti.UI.createTableView({minRowHeight:50});
    var row = Ti.UI.createTableViewRow({height:'auto',className:"row"});

    var textView = Ti.UI.createView({
      height:'auto',
      layout:'vertical',
      left:10,
      top:10,
      bottom:10,
      right:10
    });

    var l1 = Ti.UI.createLabel({
      text:sessionData.title,
      font:{fontSize:24, fontWeight:'bold'},
      height:'auto'

    });
    textView.add(l1);

    for (var i in presenterData) {
      var presenterName = Ti.UI.createLabel({
        text:presenterData[i].fullName,
        height:'auto'
      });
      textView.add(presenterName);
    }

    var room = Ti.UI.createLabel({
      text:decodeURI(sessionData.room),
      top:10,
      height:'auto'
    });
    textView.add(room);


    var body = Ti.UI.createLabel({
      text:sessionData.body,
      top:10,
      height:'auto'
    });
    textView.add(body);

    row.add(textView);

//    var imageView = Ti.UI.createImageView({
//      url:'../images/custom_tableview/user.png',
//      left:10,
//      top:10,
//      height:50,
//      width:50
//    });

//    row.add(imageView);

    tvData.push(row);
    tv.setData(tvData);

    win.add(tv);


})();
