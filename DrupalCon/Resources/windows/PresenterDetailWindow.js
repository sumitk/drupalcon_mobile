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
    if (presenterData['full_name']) {
      presenterData.fullName = presenterData['full_name'];
    }
    else {
      presenterData.fullName = '';
    }
    var presenterDetailWindow = Titanium.UI.createWindow({
      id: 'presenterDetailWindow',
      title: presenterData.name,
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    if (Ti.Platform.name == 'android') {
      var itemWidth = Ti.UI.currentWindow.width - 40;
    }
    else {
      var itemWidth = presenterDetailWindow.width - 40;
    }


    dpm(presenterData);
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
      leftImage:'images/userpictdefault6-bigger.png'
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
    
    var fullName = Ti.UI.createLabel({
      text:(presenterData.fullName != undefined) ? presenterData.fullName : presenterData.name,
      font:{fontSize: 20, fontWeight: 'bold'},
      textAlign: 'left',
      color: '#000',
      height: 'auto',
      left: 120,
      top: 15,
      ellipsize:true,
      width: itemWidth - 120
    });
    headerRow.add(fullName);

    var name = Ti.UI.createLabel({
      text:(presenterData.fullName != undefined) ? presenterData.name : '',
      font:{fontSize: 14, fontWeight: 'bold'},
      textAlign: 'left',
      color: '#999',
      height: 'auto',
      left: 120,
      width: itemWidth
    });
    headerRow.add(name);

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
        webWindow.add(webview);

        if (Ti.Platform.name == 'android') {
          var currentTab = Titanium.UI.currentTab;
        }
        else {
          var currentTab = presenterDetailWindow.tabGroup.activeTab;
        }
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

    var bio = Ti.UI.createLabel({
      text:presenterData.bio,
      backgroundColor:'#fff',
      textAlign:'left',
      color:'#000',
      top:20,
      left:10,
      right:15,
      bottom:10,
      width:itemWidth,
      height:'auto'
    });
    bioRow.add(bio);
    tvData.push(bioRow);

    tv.setData(tvData);
    presenterDetailWindow.add(tv);
    return presenterDetailWindow;
  };

})();

