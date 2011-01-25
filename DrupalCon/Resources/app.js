// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// Include the Drupal connection libraries.
Ti.include("drupal/drupal.js");
Ti.include("drupal/services.js");

Ti.include('drupal/db.js');
Ti.include('drupal/entity.js');

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

    // @todo Switch this to the generic Titanium properties API, with a custom
    // UI: http://developer.appcelerator.com/apidoc/mobile/latest/Titanium.App.Properties-module
    var m1 = menu.add({title : 'Settings'});
    m1.addEventListener('click', function(e) {
      Titanium.UI.Android.openPreferences();
    });

    // This is a placeholder for testing.  It will eventually get moved to a
    // more appropriate location within the App.
    var m2 = menu.add({title : 'Update sessions'});
    m2.addEventListener('click', function(e) {
      var service = Drupal.services.createConnection();
      service.loadHandler = function() {
        Ti.API.info("Data was loaded, called from custom handler.");
        Ti.API.info(this.responseText);
      };
      service.request({query: 'node/464'});
    });
  };
}
else if (Titanium.Platform.name == 'iPhone OS') {

}


mainWindow.open();


// Download tests, for now.  These must get moved eventually.

Drupal.db.errorMode = Drupal.db.ERROR_LEVEL_DEBUG;

// This is just for testing purposes. In practice we wouldn't
// actually want to wipe the DB on every app start. :-)
var store = Drupal.entity.db('main', 'node');
store.initializeSchema();

store.fetchUpdates('session');

//Drupal.entity.mirror('main', 'node', 464);

// This will actually not have the updated number of records,
// since the mirror request is asynchronous.
//Ti.API.info('Number of nodes on file: ' + Drupal.entity.db('main', 'node').connection.query("SELECT COUNT(*) FROM node").field(0));
