

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
      title: 'Twitter',
      window: DrupalCon.ui.createTwitterWindow(tabGroup)
  }));

  tabGroup.addTab(Titanium.UI.createTab({
      icon: 'images/tabs/star.png',
      title: 'Starred',
      window: DrupalCon.ui.createStarredWindow(tabGroup)
  }));

  tabGroup.addTab(Titanium.UI.createTab({
      icon: 'images/tabs/more.png',
      title: 'More',
      window: DrupalCon.ui.createMoreWindow(tabGroup)
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

  //
  //  TAB GROUP EVENTS
  //
  var messageWin = Titanium.UI.createWindow({
    height:30,
    width:250,
    bottom:70,
    borderRadius:10,
    touchEnabled:false,
    orientationModes : [
      Titanium.UI.PORTRAIT,
      Titanium.UI.UPSIDE_PORTRAIT,
      Titanium.UI.LANDSCAPE_LEFT,
      Titanium.UI.LANDSCAPE_RIGHT
    ]
  });
  var messageView = Titanium.UI.createView({
    id:'messageview',
    height:30,
    width:250,
    borderRadius:10,
    backgroundColor:'#000',
    opacity:0.7,
    touchEnabled:false
  });

  var messageLabel = Titanium.UI.createLabel({
    id:'messagelabel',
    text:'',
    color:'#fff',
    width:250,
    height:'auto',
    font:{
      fontFamily:'Helvetica Neue',
      fontSize:13
    },
    textAlign:'center'
  });
  messageWin.add(messageView);
  messageWin.add(messageLabel);

  //
  // TAB EVENTS
  //

  // tab group close event
  tabGroup.addEventListener('close', function(e) {
    messageLabel.text = 'tab group close event';
    messageWin.open();
    setTimeout(function() 	{
      messageWin.close({opacity:0,duration:500});
      tabGroup.open();
    }, 1000);
  });


  // tab group open event
  tabGroup.addEventListener('open', function(e) {
    messageLabel.text = 'tab group open event';
    messageWin.open();
    setTimeout(function() 	{
      messageWin.close({opacity:0,duration:500});
    }, 1000);
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


