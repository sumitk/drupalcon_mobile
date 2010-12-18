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

// Menu and settings handling is totally different between Android and iOS,
// so we have to fork the logic.  Bah.  Possibly clean this up later.
if (Titanium.Platform.osname == 'android') {
  mainWindow.activity.onCreateOptionsMenu = function(e) {
    var menu = e.menu;

    var m1 = menu.add({ title : 'Settings' });
    m1.addEventListener('click', function(e) {
      Titanium.UI.Android.openPreferences();
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
}
else if (Titanium.Platform.name == 'iPhone OS') {

}


mainWindow.open();

