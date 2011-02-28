(function() {

  DrupalCon.ui.createMapDetailWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      uid: '',
      name: '',
      tabGroup: undefined
    });

    var mapImageFileName = settings.image;

    var mapDetailWindow = Titanium.UI.createWindow({
      id: 'mapDetailWindow',
      width: 'auto',
      height: 'auto',
      title: settings.mapName,
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    if(settings.info) {
      // Add a menu or button for a booth list
      if (isAndroid()){
        // Android has a menu
        var buttons = [];

        mapDetailWindow.activity.onCreateOptionsMenu = function(e) {
          var menu = e.menu;
          var m1 = menu.add({
            title : 'Exhibitors'
          });
          m1.addEventListener('click', function(e) {
            var currentTab = (Ti.Platform.name == 'android') ? currentTab = Titanium.UI.currentTab : mapDetailWindow.tabGroup.activeTab;
            currentTab.open(DrupalCon.ui.createExhibitorsWindow({
              title: 'Exhibitors',
              tabGroup: currentTab
            }), {animated:true});
          });
        };
      }
      else {
        // iOS should only have the button.
        var button = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.INFO_LIGHT
        });
        var win = mapDetailWindow;
        win.rightNavButton = button;
        button.addEventListener('click', function() {
          var currentTab = (Ti.Platform.name == 'android') ? currentTab = Titanium.UI.currentTab : mapDetailWindow.tabGroup.activeTab;
          currentTab.open(DrupalCon.ui.createExhibitorsWindow({
            title: 'Exhibitors',
            tabGroup: currentTab
          }), {animated:true});

        });
      }
    }

  //  I am so tired that I don't know why I am doing math like below.
  //  This undoubtedly needs work.
  var ht = mapDetailWindow.toImage().height;
  if (isAndroid()) {
    var imageView = Ti.UI.createImageView({
      image: mapImageFileName,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      height: ht*2,
      width: (ht*2)*1.5,
      canScale: true
    });
    mapDetailWindow.add(imageView);

  }
  else {
    var baseHTML = '<html><head></head><body class="maps">' +
      '  <meta name="viewport" content="target-densityDpi=device-dpi, user-scalable=yes, width=device-width, initial-scale = .25, minimum-scale = .25, maximum-scale = 4.0" />' +
      '  <meta name="apple-mobile-web-app-capable" content="yes" />' +
      '<div class="map">' +
      '<div><img src="' + mapImageFileName + '" /></div>' +
      '</body></html>';
    var web = Ti.UI.createWebView({scalesPageToFit:true});
    mapDetailWindow.add(web);
    web.html = baseHTML;
  }


    

    return mapDetailWindow;
  };
})();