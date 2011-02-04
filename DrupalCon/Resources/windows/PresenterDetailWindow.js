(function() {
  dpm("in presenterDetailWindow.js");
  
  DrupalCon.ui.createPresenterDetailWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      uid: '',
      name: '',
      tabGroup: undefined
    });

    var presenterDetailWindow = Titanium.UI.createWindow({
      id: 'presenterDetailWindow',
      title: settings.title,
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    if (Ti.Platform.name == 'android') {
      var itemWidth = Ti.UI.currentWindow.width - 40;
    }
    else {
      var itemWidth = presenterDetailWindow.width - 40;
    }
    var presenterData = settings.data;
    dpm(presenterData);
    // Build the page:
    // Structure
    var tvData = [];

//    var tv = Ti.UI.createTableView({
//      minRowHeight: 50,
//      textAlign: 'left',
//      borderColor:"#fff"
//    });
//
//    var row = Ti.UI.createTableViewRow({
//      height:'auto',
//      className:"row",
//      borderColor:"#fff",
//      bottom: 10
//    });

    var textView = Ti.UI.createView({
      height: 'auto',
      layout: 'vertical',
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      left: 10,
      top: 10,
      right: 10,
      bottom: 10
    });


    // Content
    var titleLabel = Ti.UI.createLabel({
      text:cleanSpecialChars(presenterData.fullName),
      font:{fontSize: 24, fontWeight: 'bold'},
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      height: 'auto',
      width: itemWidth
    });
    textView.add(titleLabel);

    var twitter = Ti.UI.createLabel({
      text:presenterData.data.name + "'s Twitter Page",
      twitter:presenterData.data.twitter,
      color:'#0779BE',
      top: 10,
      bottom: 10,
      left: 15,
      right: 15,
      height: 50
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
        var button = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.DONE
        });
        button.addEventListener('click', function(e) {
          webWindow.close();
        });
        webWindow.rightNavButton = button;
      }
      webWindow.open({modal:true, animated:true});
    });
    textView.add(twitter);

    var bio = Ti.UI.createLabel({
      text:presenterData.data.bio,
      backgroundColor:'#fff',
      textAlign:'left',
      color:'#000',
      top:20,
      bottom:10,
      width:itemWidth,
      height:'auto'
    });
    textView.add(bio);


//    row.add(textView);
//    tvData.push(row);
//    tv.setData(tvData);

    presenterDetailWindow.add(textView);

    return presenterDetailWindow;
  };

})();

