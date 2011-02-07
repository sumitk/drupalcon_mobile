

(function() {

  // create tab group
  var tabGroup = Titanium.UI.createTabGroup({id:'tabGroup1'});

  tabGroup.addTab(Titanium.UI.createTab({
    icon: 'images/tabs/KS_nav_ui.png',
    title: 'Schedule',
    window: DrupalCon.ui.createDayWindow(tabGroup)
  }));

  tabGroup.addTab(Titanium.UI.createTab({
    icon: 'images/tabs/KS_nav_mashup.png',
    title: 'Maps',
    window: DrupalCon.ui.createMapWindow(tabGroup)
  }));

  tabGroup.addTab(Titanium.UI.createTab({
      icon: 'images/tabs/twitter.png',
      title: 'News',
      window: DrupalCon.ui.createTwitterWindow(tabGroup)
  }));

  
// Implement starred later
//  tabGroup.addTab(Titanium.UI.createTab({
//      icon: 'images/tabs/star.png',
//      title: 'Starred',
//      window: DrupalCon.ui.createStarredWindow(tabGroup)
//  }));

  tabGroup.addTab(Titanium.UI.createTab({
      icon: 'images/tabs/more.png',
      title: 'Presenters',
      window: DrupalCon.ui.createPresentersWindow(tabGroup)
  }));

  tabGroup.addEventListener('open',function() {
    // set background color back to white after tab group transition
    Titanium.UI.setBackgroundColor('#fff');
  });

  // Display the tab group, thus kicking off the application.
  tabGroup.setActiveTab(0);
  // open tab group with a transition animation
  tabGroup.open({
    transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
  });

  // tab group close event
  tabGroup.addEventListener('close', function(e) {
    var messageWin = Drupal.createNoticeDialog('tab group close event');
    messageWin.show(1000);
  });

  // tab group open event
  tabGroup.addEventListener('open', function(e) {
    var messageWin = Drupal.createNoticeDialog('tab group open event');
    messageWin.show(1000);
  });

  Ti.addEventListener('drupal:entity:datastore:update_completed', function(e) {
    Drupal.createNoticeDialog('Update completed.').show(3000);
    Ti.API.info('Update completed.');
  });

  Ti.addEventListener('drupalcon:update_data', function(e) {
    Drupal.entity.db('main', 'node').fetchUpdates('session');
  });

  Ti.addEventListener('drupalcon:update_data', function(e) {
    Drupal.entity.db('main', 'user').fetchUpdates('user');
  });

})();
