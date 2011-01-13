// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// Include the Drupal connection libraries.
Ti.include("drupal/drupal.js");
Ti.include("drupal/services.js");
Ti.include('drupal/db.js');
Ti.include('drupal/entity.js');
Ti.include('lib/twitter_services.js');


Ti.include('drupalcon/entity.js');

// Define our connection information.  This is very similar to the DB layer's
// $databases array in settings.php.
Drupal.services.addConnectionInfo('main', {
  endpointUrl: 'http://chicago2011.drupal.org/services/mobile',
  user: '',
  pass: ''
});

// Register our database information.
Drupal.db.addConnectionInfo('main');

// create tab group
var tabGroup = Titanium.UI.createTabGroup({id:'tabGroup1'});

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({
  id:'win1',
  backgroundImage:'background.png',
});

desc = "<p style='font-size: 12px;'>This app was produced by Patrick Teglia (Copyright 2010-2011). You may find updates ";
desc += 'or news about the app on his website: <a href="http://patrickteglia.com">http://patrickteglia.com</a></p>';

var wb = Ti.UI.createWebView({
  html:desc,
  height: 150,
  backgroundColor:'transparent',
});

win1.add(wb);

var tab1 = Titanium.UI.createTab({
	id:'tab1',
  icon:'images/tabs/KS_nav_ui.png',
  title:'Schedule',
  window:win1
});

//
// create controls tab and root window
//
var win2 = Titanium.UI.createWindow({
    url:'windows/preferences.js',
    title:'Maps'
});
var tab2 = Titanium.UI.createTab({
    icon:'images/tabs/KS_nav_mashup.png',
    title:'Maps',
    window:win2
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
tabGroup.addTab(tab1);
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
	Titanium.UI.LANDSCAPE_RIGHT,
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
tabGroup.addEventListener('close', function(e)
{
	messageLabel.text = 'tab group close event';
	messageWin.open();
	setTimeout(function()
	{
		messageWin.close({opacity:0,duration:500});
		tabGroup.open();
	},1000);
});


// tab group open event
tabGroup.addEventListener('open', function(e)
{
	messageLabel.text = 'tab group open event';
	messageWin.open();
	setTimeout(function()
	{
		messageWin.close({opacity:0,duration:500});
	},1000);

});

// focus event listener for tracking tab changes
tabGroup.addEventListener('focus', function(e)
{
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
tabGroup.addEventListener('blur', function(e)
{
	//Titanium.API.info('tab blur - new index ' + e.index + ' old index ' + e.previousIndex);
});


// Testing fetching preferences from the preferences.js file
var checkButton = Titanium.UI.createButton({
  title:'Check user/pass',
  top: 10,
  width:300,
  height: 40
});
checkButton.addEventListener('click',function(e){
  var pass = Titanium.App.Properties.getString("sitePassword");
  var user = Titanium.App.Properties.getString("siteUsername");
  alert("User: " + user + " and Pass: " + pass);
});
win1.add(checkButton);

win1.activity.onCreateOptionsMenu = function(e) {
  var menu = e.menu;

  var m1 = menu.add({ title : 'Settings' });
  m1.addEventListener('click', function(e) {
    Ti.API.info("Clicked Settings.");
    var preferencesWindow = Titanium.UI.createWindow({
      url:'windows/preferences.js',
      title:'Preferences',
      backgroundColor: '#000'
    });
    preferencesWindow.open({modal:true});
    
  });
  var m2 = menu.add({ title : 'Update sessions' });
  m2.addEventListener('click', function(e) {
    Ti.API.info("Update button was clicked.");
    // Do stuff here to test downloading sessions.
    Ti.API.info("Requesting new service object.");
    var service = Drupal.createConnection({endpointUrl: 'http://chicago2011.garfield.sandbox/mobile/test'});
    service.loadHandler = function() {
      Ti.API.info("Data was loaded, called from custom handler.");
    };
    Ti.API.info("Making request.");
    service.request({method: 'GET', query: 'node/464', format: 'json'});
  });
};

// Download tests, for now.  These must get moved eventually.

Drupal.db.errorMode = Drupal.db.ERROR_LEVEL_DEBUG;

// This is just for testing purposes. In practice we wouldn't
// actually want to wipe the DB on every app start. :-)
var store = Drupal.entity.db('main', 'node');
store.initializeSchema();


Drupal.entity.mirror('main', 'node', 464);

// This will actually not have the updated number of records,
// since the mirror request is synchronous.
Ti.API.info('Number of nodes on file: ' + Drupal.entity.db('main', 'node').connection.query("SELECT COUNT(*) FROM node").field(0));

