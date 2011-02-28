
(function() {

  var uiEnabled = true;

  DrupalCon.ui.createAboutWindow = function(tabGroup) {
    var aboutWindow = Titanium.UI.createWindow({
      id: 'aboutWindow',
      title: 'About DrupalCon Chicago',
      backgroundColor: '#FFF',
      width: 'auto',
      height: 'auto',
      tabGroup: tabGroup
    });

    var aboutText = Ti.UI.createWebView({
      url: 'windows/about.html'
    });

    
    aboutWindow.add(aboutText);

    aboutWindow.addEventListener('focus', function() {
      uiEnabled = true;
    });

    return aboutWindow;
  };

})();
