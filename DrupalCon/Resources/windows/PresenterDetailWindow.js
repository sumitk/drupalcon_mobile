(function() {

  DrupalCon.ui.createPresenterDetailWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      uid: '',
      name: '',
      tabGroup: undefined
    });

    // var presenterData = settings.data;
    var presenterData = Drupal.entity.db('main', 'user').load(settings.uid);

    var sessions = getRelatedSessions(presenterData.name);

    var presenterDetailWindow = Titanium.UI.createWindow({
      id: 'presenterDetailWindow',
      title: presenterData.name,
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    var itemWidth = (Ti.Platform.name == 'android') ? (Ti.UI.currentWindow.width - 40) : (presenterDetailWindow.width - 40);

    var tvData = [];
    var blueBg = '#CAE2F4';
    var	platformWidth = Ti.Platform.displayCaps.platformWidth;
    var platformHeight = Ti.Platform.displayCaps.platformHeight;

    // Structure
    var tv = Ti.UI.createTableView({
      textAlign: 'left',
      layout:'vertical'
    });
    var headerRow = Ti.UI.createTableViewRow({
      height:110,
      backgroundColor:blueBg,
      left:0,
      top:-5,
      bottom:0,
      layout:'vertical',
      leftImage:'images/userpict-large.png'
    });
    var twitterRow = Ti.UI.createTableViewRow({hasChild:true,height:40});
    var linkedinRow = Ti.UI.createTableViewRow({hasChild:true,height:40});
    var facebookRow = Ti.UI.createTableViewRow({hasChild:true,height:40});
    var bioRow = Ti.UI.createTableViewRow({hasChild:false,height:'auto'});

    // Content
//    var avatar = Ti.UI.createImageView({
//      height: 110,
//      width: 110,
//      image:'images/userpictdefault6-bigger.png',
//      top: 0,
//      left: 0
//    });
//    headerRow.add(avatar);
    
    if (presenterData.full_name != undefined) {
      var fullName = Ti.UI.createLabel({
        text: presenterData.full_name,
        font: {fontSize: 20, fontWeight: 'bold'},
        textAlign: 'left',
        color: '#000',
        height: 'auto',
        left: 120,
        top: 15,
        ellipsize:true,
        width: itemWidth - 120
      });
      headerRow.add(fullName);
    }

    var name = Ti.UI.createLabel({
      text: (presenterData.full_name !== presenterData.name) ? presenterData.name : '',
      font: {fontSize: 14, fontWeight: 'bold'},
      textAlign: 'left',
      color: '#666',
      height: 'auto',
      left: 120,
      width: itemWidth
    });
    headerRow.add(name);

    if (presenterData.company != undefined) {
      var company = Ti.UI.createLabel({
        text:presenterData.company,
        font:{fontSize: 14, fontWeight: 'bold'},
        textAlign: 'left',
        color: '#999',
        height: 'auto',
        left: 120,
        width: itemWidth - 120
      });
      headerRow.add(company);
    }
    
    tvData.push(headerRow);


    if (presenterData.twitter != undefined){
      var twitter = Ti.UI.createLabel({
        text:"twitter: " + presenterData.name,
        twitter:presenterData.twitter,
        color:'#000',
        font:{fontSize: 14, fontWeight: 'bold'},
        left: 15,
        right: 15,
        height: 'auto'
      });

      twitter.addEventListener('click', function(e) {
        var webview = Titanium.UI.createWebView({url:e.source.twitter});
        var webWindow = Titanium.UI.createWindow();
        var currentTab = (Ti.Platform.name == 'android') ? Titanium.UI.currentTab : presenterDetailWindow.tabGroup.activeTab;
        webWindow.add(webview);
        currentTab.open(webWindow);
      });
      twitterRow.add(twitter);
      tvData.push(twitterRow);
    }

//    if (presenterData.data.linkedin != undefined){
//
//    }
//
//    if (presenterData.data.facebook != undefined){
//
//    }
    if (presenterData.bio != undefined) {
      var bio = Ti.UI.createLabel({
        text:presenterData.bio.replace('\n','\n\n'),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        height:'auto',
        width:'auto',
        left:10,
        right:10,
        top:10,
        bottom:10
      });
      bioRow.add(bio);
      tvData.push(bioRow);
    }

    for (var i in sessions) {
      
      dpm(sessions[i].title);
    }

    tv.setData(tvData);
    presenterDetailWindow.add(tv);
    return presenterDetailWindow;
  };

  function getRelatedSessions(name) {
    var conn = Drupal.db.getConnection('main');
    var rows = conn.query("SELECT nid, title FROM node WHERE instructors LIKE ? ORDER BY start_date, nid", ['%' + name + '%']);

    var nids = [];
    while(rows.isValidRow()) {
      nids.push(rows.fieldByName('nid'));
      rows.next();
    }
    rows.close();

    var sessions = Drupal.entity.db('main', 'node').loadMultiple(nids, ['start_date', 'nid']);

    return sessions;
  }

})();

