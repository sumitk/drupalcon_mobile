// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

Ti.include("drupal.js");

var mainWindow = Titanium.UI.createWindow({
  title: 'Home',
  backgroundColor: '#000',
  fullscreen: true // Menus don't work without this for some reason.
});

var label1 = Titanium.UI.createLabel({
  color:'#999',
  text:'I am Window 1',
  font:{fontSize:20,fontFamily:'Helvetica Neue'},
  textAlign:'center',
  width:'auto'
});
mainWindow.add(label1);

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
mainWindow.add(checkButton);

mainWindow.activity.onCreateOptionsMenu = function(e) {
  var menu = e.menu;

  var m1 = menu.add({ title : 'Settings' });
  m1.addEventListener('click', function(e) {
    Ti.API.info("Clicked Settings.");
    var preferencesWindow = Titanium.UI.createWindow({
      url:'preferences.js',
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


mainWindow.open();

