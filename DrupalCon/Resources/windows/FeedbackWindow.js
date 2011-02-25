(function() {

  DrupalCon.ui.createFeedbackWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      address: '',
      tabGroup: undefined
    });

    var feedbackWindow = Titanium.UI.createWindow({
      id: 'feedbackWindow',
      title: settings.title,
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    var web = Ti.UI.createWebView({
      url:settings.address
    });

    feedbackWindow.add(web);

    return feedbackWindow;
  };

})();