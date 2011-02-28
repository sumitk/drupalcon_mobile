

(function() {

  // create tab group
  var tabGroup = Titanium.UI.createTabGroup({id:'tabGroup1'});

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

  
// Implement starred later
//  tabGroup.addTab(Titanium.UI.createTab({
//      icon: 'images/tabs/star.png',
//      title: 'Starred',
//      window: DrupalCon.ui.createStarredWindow(tabGroup)
//  }));

  tabGroup.addTab(Titanium.UI.createTab({
      icon: (isAndroid()) ? 'images/tabs/bofs_android.png' : 'images/tabs/bofs.png',
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

  });

  // tab group open event
  tabGroup.addEventListener('open', function(e) {

  });

  // Add a menu to all pages except news (which would be confusing).
  tabGroup.addEventListener('focus', function(e) {
    dpm(e.index);
    if (!e.index) {
      alert("YAY, tab 0!");
    }
    dpm( tabGroup.tabs[e.index].window);
    if (e.index == 0.0 || e.index == 3.0 || e.index == 0 || e.index == 3){
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
    Drupal.createNoticeDialog('Update completed.').show(3000);
    Ti.API.info('Update completed.');
  });

  Ti.addEventListener('drupalcon:update_data', function(e) {
    Drupal.createNoticeDialog('Updating session and presenter data.').show(2000);
    Drupal.entity.db('main', 'node').fetchUpdates('all');
    //Drupal.entity.db('main', 'node').fetchUpdates('session');
    Drupal.entity.db('main', 'user').fetchUpdates('user');
  });

})();
