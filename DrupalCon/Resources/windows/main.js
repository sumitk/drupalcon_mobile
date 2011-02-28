

(function() {

  // create tab group
  var tabGroup = Titanium.UI.createTabGroup({
    id:'tabGroup1',
  });

  tabGroup.addTab(Titanium.UI.createTab({
    icon: (isAndroid()) ? 'images/tabs/schedule_android.png' : 'images/tabs/schedule.png',
    title: 'Schedule',
    window: DrupalCon.ui.createDayWindow(tabGroup)
  }));

  tabGroup.addTab(Titanium.UI.createTab({
    icon: (isAndroid()) ? 'images/tabs/maps_android.png' : 'images/tabs/maps.png',
    title: 'Maps',
    window: DrupalCon.ui.createMapWindow(tabGroup)
  }));

  tabGroup.addTab(Titanium.UI.createTab({
      icon: (isAndroid()) ? 'images/tabs/news_android.png' : 'images/tabs/news.png',
      title: 'News',
      window: DrupalCon.ui.createTwitterWindow(tabGroup)
  }));

  tabGroup.addTab(Titanium.UI.createTab({
      icon: (isAndroid()) ? 'images/tabs/bofs_android.png' : 'images/tabs/bofs.png',
      title: 'Speakers',
      window: DrupalCon.ui.createPresentersWindow(tabGroup)
  }));

  tabGroup.addTab(Titanium.UI.createTab({
      icon: (isAndroid()) ? 'images/tabs/about_android.png' : 'images/tabs/about.png',
      title: 'About',
      window: DrupalCon.ui.createHtmlWindow({title: 'About', url: 'pages/about.html', tabGroup: tabGroup})
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

  });

  // tab group open event
  tabGroup.addEventListener('open', function(e) {

  });

  // Add a menu to all pages except news (which would be confusing).
  tabGroup.addEventListener('focus', function(e) {
    //dpm(e.index);
    if (e.index != 1 && e.index !=2){
      if (isAndroid()){
        // Android has a menu
        var buttons = [];
        buttons.push({
          title: "Update",
          clickevent: function () {
            Ti.fireEvent('drupalcon:update_data');
          }
        });
        menu.init({
          win: tabGroup.tabs[e.index].window,
          buttons: buttons
        });
      }
      else {
        
        // iOS should only have the button.
        var button = Ti.UI.createButton({
          systemButton: Ti.UI.iPhone.SystemButton.REFRESH
        });
        var win = tabGroup.tabs[e.index].window;
        win.rightNavButton = button;
        button.addEventListener('click', function() {
          Ti.fireEvent('drupalcon:update_data');
        })
      }
    }
  });

  Ti.addEventListener('drupal:entity:datastore:update_completed', function(e) {
    Drupal.createNoticeDialog('Update completed.').show(2000);
    Ti.API.info('Update completed.');
  });

  Ti.addEventListener('drupalcon:update_data', function(e) {
    Drupal.createNoticeDialog('Updating session and presenter data.').show(2000);
    Drupal.entity.db('main', 'node').fetchUpdates('all');
    //Drupal.entity.db('main', 'node').fetchUpdates('session');
    Drupal.entity.db('main', 'user').fetchUpdates('user');
  });

})();
