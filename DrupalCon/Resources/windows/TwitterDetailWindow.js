(function() {

  DrupalCon.ui.createTwitterDetailWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      uid: '',
      name: '',
      tabGroup: undefined
    });

    var twitterDetailWindow = Titanium.UI.createWindow({
      id: 'twitterDetailWindow',
      title: settings.title,
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });
    var baseHTMLStart = '<html><head><link rel="stylesheet" type="text/css" href="windows/tweetWebView.css" /></head><body>' +
      '<div class="created-at">' + settings.date + '</div>',
      baseHTMLEnd = '<script type="text/javascript" src="windows/tweetWebView.js"></script></body></html>';

    var tweet = settings.text;

    var web = Ti.UI.createWebView();
    twitterDetailWindow.add(web);

    // parse the tweet and set it as the HTML for the web view
    var parser = new twitterParser(tweet);
    parser.linkifyURLs();
    parser.linkifyHashTags();
    parser.linkifyAtTags();
    web.html = baseHTMLStart + parser.getHTML() + baseHTMLEnd;

    return twitterDetailWindow;
  }

})();