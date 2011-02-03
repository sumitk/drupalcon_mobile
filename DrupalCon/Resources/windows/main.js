

(function() {
  dpm('A');

  // create tab group
  var tabGroup = Titanium.UI.createTabGroup({id:'tabGroup1'});

  dpm('B');


  var dayTab = Titanium.UI.createTab({
    id: 'dayTab',
    icon: 'images/tabs/KS_nav_ui.png',
    title: 'Schedule',
    window: DrupalCon.ui.createDayWindow(tabGroup)
  });

  var tab2 = Titanium.UI.createTab({
    icon: 'images/tabs/KS_nav_mashup.png',
    title: 'Maps',
    window: DrupalCon.ui.createMapWindow(tabGroup)
  });


  //
  // create phone tab and root window
  //
  var win3 = Titanium.UI.createWindow({
      url:'windows/twitter.js',
      titleid:'twitter_win_title'
  });
  var tab3 = Titanium.UI.createTab({
      icon:'images/tabs/twitter.png',
      title:'Twitter',
      window:win3
  });

  //
  // create platform tab and root window
  //
  var win4 = Titanium.UI.createWindow({
      url:'windows/preferences.js',
      title:'Starred'
  });
  var tab4 = Titanium.UI.createTab({
      icon:'images/tabs/star.png',
      title:'Starred',
      window:win4
  });

  //
  // create mashup tab and root window
  //
  var win5 = Titanium.UI.createWindow({
      url:'windows/preferences.js',
      title:'More'
  });
  var tab5 = Titanium.UI.createTab({
      icon:'images/tabs/more.png',
      title:'More',
      window:win5
  });

  //
  //  add tabs
  //
  tabGroup.addTab(dayTab);
  tabGroup.addTab(tab2);
  tabGroup.addTab(tab3);
  tabGroup.addTab(tab4);
  tabGroup.addTab(tab5);

  tabGroup.addEventListener('open',function()
  {
          // set background color back to white after tab group transition
          Titanium.UI.setBackgroundColor('#fff');
  });

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

  // focus event listener for tracking tab changes
  tabGroup.addEventListener('focus', function(e) {
    //messageLabel.text = 'tab changed to ' + e.index + ' old index ' + e.previousIndex;
    //messageWin.open();
    //setTimeout(function()
    //{
    //	Ti.API.info('tab ' + e.tab.title  + ' prevTab = ' + (e.previousTab ? e.previousTab.title : null));
    //	messageLabel.text = 'active title ' + e.tab.title + ' old title ' + (e.previousTab ? e.previousTab.title : null);
    //},1000);
    //
    //setTimeout(function()
    //{
    //	messageWin.close({opacity:0,duration:500});
    //},2000);

  });

  // blur event listener for tracking tab changes
  tabGroup.addEventListener('blur', function(e) {
    //Titanium.API.info('tab blur - new index ' + e.index + ' old index ' + e.previousIndex);
  });


  dpm('D');


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


