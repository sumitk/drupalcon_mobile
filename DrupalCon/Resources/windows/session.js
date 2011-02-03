(function() {

  var rootPath = '../../../../../../../../../../';
  Ti.include(
    rootPath + "drupal/drupal.js",
    rootPath + "drupal/services.js",
    rootPath + "drupal/db.js",
    rootPath + "drupal/entity.js",
    rootPath + "lib/platforms.js",
    rootPath + "lib/misc.js"
  );

  Ti.API.info('Start of session.js: ');

  var win = Titanium.UI.currentWindow;
  win.backgroundColor = '#fff';
  win.color = '#000';
  var itemWidth = win.width-40;
  
  // Build session data
  var sessionData = Drupal.entity.db('main', 'node').load(win.nid);

  // dpm(sessionData);
  // Build presenter data
  var presenterData = [];
  var sessionInstructors = sessionData.instructors;
  // Instructors may be single (string) or multiple (object), this part works.
  var instructors = [];
  if (typeof sessionInstructors === 'string') {
    instructors.push(sessionInstructors);
  }
  else {
    instructors = sessionInstructors;
  }

  for(var i in instructors) {
    var rows = Drupal.db.getConnection('main').query("SELECT data,full_name FROM user WHERE name = ?", [instructors[i]]);
    while (rows.isValidRow()) {
      presenterData.push({
        'data':JSON.parse(rows.fieldByName('data')),
        'fullName':rows.fieldByName('full_name')
      });
      rows.next();
    }
    rows.close();
  }

  // Build the page:
  var tvData = [];
  var tv = Ti.UI.createTableView({
    minRowHeight:50,
    textAlign:'left'
  });
  var row = Ti.UI.createTableViewRow({height:'auto',className:"row"});

  var textView = Ti.UI.createView({
    height:'auto',
    layout:'vertical',
    backgroundColor:'#fff',
    textAlign:'left',
    color:'#000',
    left:10,
    top:10,
    bottom:10,
    right:10
  });

  var l1 = Ti.UI.createLabel({
    text:cleanSpecialChars(sessionData.title),
    font:{fontSize:24, fontWeight:'bold'},
    backgroundColor:'#fff',
    textAlign:'left',
    color:'#000',
    height:'auto',
    width:itemWidth
  });
  textView.add(l1);

  for (var i in presenterData) {
    var presenterName = Ti.UI.createLabel({
      text:presenterData[i].fullName,
      backgroundColor:'#fff',
      font:{fontSize:18, fontWeight:'bold'},
      textAlign:'left',
      color:'#000',
      height:'auto',
      width:itemWidth
    });
    textView.add(presenterName);
  }

  var room = Ti.UI.createLabel({
    text:cleanSpecialChars(sessionData.room),
    backgroundColor:'#fff',
    textAlign:'left',
    color:'#000',
    top:10,
    width:itemWidth,
    height:'auto'
  });
  textView.add(room);


  var body = Ti.UI.createLabel({
    text:sessionData.body,
    backgroundColor:'#fff',
    textAlign:'left',
    color:'#000',
    top:20,
    width:itemWidth,
    height:'auto'
  });
  textView.add(body);

  for (var i in presenterData) {
    var presenterName2 = Ti.UI.createLabel({
      text:presenterData[i].fullName + "(" + presenterData[i].data.name + ")",
      backgroundColor:'#fff',
      textAlign:'left',
      color:'#000',
      top:20,
      height:'auto',
      width:itemWidth
    });
    textView.add(presenterName2);
  }

  for (var i in presenterData) {
    var twitter = Ti.UI.createLabel({
      text:presenterData[i].data.twitter,
      backgroundColor:'#fff',
      textAlign:'left',
      color:'#000',
      height:'auto',
      width:itemWidth
    });
    textView.add(twitter);
  }

  var audienceTitle = Ti.UI.createLabel({
    text:"Intended Audience",
    backgroundColor:'#fff',
    textAlign:'left',
    font:{fontSize:18, fontWeight:'bold'},
    color:'#000',
    top:20,
    width:itemWidth,
    height:'auto'
  });
  textView.add(audienceTitle);

  var audience = Ti.UI.createLabel({
    text:sessionData.audience,
    backgroundColor:'#fff',
    textAlign:'left',
    color:'#000',
    top:10,
    width:itemWidth,
    height:'auto'
  });
  textView.add(audience);

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
