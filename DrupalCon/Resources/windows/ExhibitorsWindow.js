(function() {

  DrupalCon.ui.createExhibitorsWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      tabGroup: undefined
    });


    var exhibitorsWindow = Titanium.UI.createWindow({
      id: 'exhibitorsWindow',
      width: 'auto',
      height: 'auto',
      title: settings.title,
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    var web = Ti.UI.createWebView({url: 'windows/exhibitors.html'});
    exhibitorsWindow.add(web);

    return exhibitorsWindow;
  };
})();