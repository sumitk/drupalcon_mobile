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
      title: settings.mapName,
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });
//
//    mapDetailWindow.addEventListener('focus', function() {
//      // We should be showing the "tap to zoom" message here, but for some reason
//      // it doesn't unshow from here. Eventually we may figure this out.
//    });
//
//    var scrollView = Titanium.UI.createScrollView({
//      contentWidth:'auto',
//      contentHeight:'auto',
//      top:0,
//      showVerticalScrollIndicator:true,
//      showHorizontalScrollIndicator:true,
//      backgroundColor:'#031a28'
//    });
//    var view = Ti.UI.createView({
//      backgroundImage:mapImageFileName,
//      borderRadius:0,
//      width:480,
//      height:240,
//      top:0
//    });
//    var center1 = null;
//    var scaled1 = false;
//
//    var theZoomScale = 1.0;
//    scrollView.addEventListener('scale', function(e){
//      var currentScale = e.scale;
//    });
//
//    scrollView.addEventListener('doubletap', function(e){
//      var t = Titanium.UI.create2DMatrix();
//
//      if (!scaled1) {
//        //dpm('center: ' + scrollView.center);
//        t = t.scale(theZoomScale);
//        view.width = 1000;
//        view.height = 525;
//        scrollView.contentWidth = 1000;
//        scrollView.contentHeight = 525;
//        scaled1 = true;
//      }
//      else {
//        view.width = 500;
//        view.height = 250;
//        scrollView.contentWidth = 500;
//        scrollView.contentHeight = 250;
//        scaled1 = false;
//      }
//
////
////      if (currentScale > theZoomScale) {
////        Ti.API.info("Zoomed at: " + e.x + ", " + e.y + " zoom: " + currentScale);
////        scrollView.zoomScale = theZoomScale;
////      }
////      else {
////        Ti.API.info("Not zoomed at: " + e.x + ", " + e.y + " zoom: " + currentScale);
////        scrollView.scrollTo(e.x, e.y);
////        scrollView.zoomScale = 2;
////      }
//    });
//
//    scrollView.add(view);
//    mapDetailWindow.add(scrollView);
//
//    Drupal.createNoticeDialog('Double-Tap to Zoom.').show(3000);

  if (isAndroid()) {
    var baseHTML = '<html><head>' +
      '  <meta name="viewport" content="target-densitydpi=device-dpi, user-scalable=yes, width=device-width, initial-scale = 1.0, minimum-scale = 1.0, maximum-scale = 4.0" />' +
      '</head><body class="maps"><div class="map">' +
      '<div><img src="' + mapImageFileName + '" /></div>' +
      '</body></html>';
  }
  else {
    var baseHTML = '<html><head></head><body class="maps">' +
      '  <meta name="viewport" content="target-densitydpi=device-dpi, user-scalable=yes, width=device-width, initial-scale = .25, minimum-scale = .25, maximum-scale = 4.0" />' +
      '  <meta name="apple-mobile-web-app-capable" content="yes" />' +
      '<div class="map">' +
      '<div><img src="' + mapImageFileName + '" /></div>' +
      '</body></html>';
  }
  var web = Ti.UI.createWebView({scalesPageToFit:true});
  mapDetailWindow.add(web);
  web.html = baseHTML;

    

    return mapDetailWindow;
  };
})();