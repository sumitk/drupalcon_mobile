
(function() {

  DrupalCon.ui.createSessionDetailWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      nid: '',
      tabGroup: undefined
    });

    var sessionDetailWindow = Titanium.UI.createWindow({
      id: 'sessionDetailWindow',
      title: settings.title,
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    if (Ti.Platform.name == 'android') {
      var itemWidth = Ti.UI.currentWindow.width - 40;
    }
    else {
      var itemWidth = sessionDetailWindow.width - 40;
    }
    

    // Build session data
    var sessionData = Drupal.entity.db('main', 'node').load(settings.nid);

    dpm(sessionData);
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
          'data': JSON.parse(rows.fieldByName('data')),
          'fullName': rows.fieldByName('full_name')
        });
        rows.next();
      }
      rows.close();
    }

    // Build the page:
    var tvData = [];
    var tv = Ti.UI.createTableView({
      minRowHeight: 50,
      textAlign: 'left',
      borderColor:"#fff"
    });
    var row = Ti.UI.createTableViewRow({height:'auto',className:"row",borderColor:"#fff"});

    var textView = Ti.UI.createView({
      height: 'auto',
      layout: 'vertical',
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      left: 10,
      top: 10,
      right: 10
    });

    var titleLabel = Ti.UI.createLabel({
      text:cleanSpecialChars(sessionData.title),
      font:{fontSize: 24, fontWeight: 'bold'},
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      height: 'auto',
      width: itemWidth
    });
    textView.add(titleLabel);

    for (var i in presenterData) {
      dpm(presenterData[i]);
      var presenterName = Ti.UI.createLabel({
        text: presenterData[i].fullName,
        backgroundColor: '#fff',
        font:{fontSize: 18, fontWeight: 'bold'},
        textAlign: 'left',
        color: '#000',
        height: 'auto',
        width: itemWidth
      });
      textView.add(presenterName);
    }

    var room = Ti.UI.createLabel({
      text: cleanSpecialChars(sessionData.room),
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      top: 10,
      width: itemWidth,
      height: 'auto'
    });
    textView.add(room);


    var body = Ti.UI.createLabel({
      text:sessionData.body,
      backgroundColor:'#fff',
      textAlign:'left',
      color:'#000',
      top:20,
      bottom:10,
      width:itemWidth,
      height:'auto'
    });
    textView.add(body);

    row.add(textView);
    tvData.push(row);

    var presenterName2 = [];
    var row2 = [];
    var twitter = [];
    
    for (var i in presenterData) {
      row2[i] = Ti.UI.createTableViewRow({height:'auto',className:"row",borderColor:'#fff'});
      presenterName2[i] = Ti.UI.createButton({
        title:presenterData[i].fullName + " (" + presenterData[i].data.name + ")",
        uid:presenterData[i].data.uid,
        name:presenterData[i].data.name,
        top: 10,
        bottom: 10,
        left: 15,
        right: 15,
        height: 50
      });
      twitter[i] = Ti.UI.createLabel({
        text:presenterData[i].data.twitter,
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        height:'auto',
        top: 70,
        width:itemWidth
      });

      presenterName2[i].addEventListener('click', function(e) {
        if (Ti.Platform.name == 'android') {
          var currentTab = Titanium.UI.currentTab;
        }
        else {
          var currentTab = sessionDetailWindow.tabGroup.activeTab;
        }
        currentTab.open(DrupalCon.ui.createPresenterDetailWindow({
          title: e.source.name,
          uid: e.source.uid,
          name: e.source.name,
          tabGroup: Titanium.UI.currentTab
        }), {animated:true});
      });

      twitter[i].addEventListener('click', function(e) {
        if (Ti.Platform.name == 'android') {
          var currentTab = Titanium.UI.currentTab;
        }
        else {
          var currentTab = sessionDetailWindow.tabGroup.activeTab;
        }
        var webview = Titanium.UI.createWebView({url:e.source.text});
        var webWindow = Titanium.UI.createWindow();
        webWindow.add(webview);
        webWindow.open({modal:true, animated:true});
      });

      row2[i].add(presenterName2[i]);
      row2[i].add(twitter[i]);
      tvData.push(row2[i]);
    }

    var row3 = Ti.UI.createTableViewRow({height:'auto',className:"row",borderColor:"#fff"});

    var textViewBottom = Ti.UI.createView({
      height: 'auto',
      layout: 'vertical',
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      left: 10,
      right: 10
    });

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
    textViewBottom.add(audienceTitle);

    var audience = Ti.UI.createLabel({
      text:sessionData.audience,
      backgroundColor:'#fff',
      textAlign:'left',
      color:'#000',
      top:10,
      width:itemWidth,
      height:'auto'
    });
    textViewBottom.add(audience);

    row3.add(textViewBottom);



    tvData.push(row3);
    tv.setData(tvData);

    sessionDetailWindow.add(tv);


    return sessionDetailWindow;
  };

})();

