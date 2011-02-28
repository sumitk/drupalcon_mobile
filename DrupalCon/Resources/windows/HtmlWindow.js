
(function() {

  DrupalCon.ui.createHtmlWindow = function(settings, tabGroup) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      tabGroup: undefined,
      url: ''
    });

    var htmlWindow = Titanium.UI.createWindow({
      id: 'htmlWindow',
      title: settings.title,
      backgroundColor: '#FFF',
      width: 'auto',
      height: 'auto',
      tabGroup: tabGroup
    });
    
    htmlWindow.add(Ti.UI.createWebView({
      url: settings.url
    }));

    return htmlWindow;
  };

})();
