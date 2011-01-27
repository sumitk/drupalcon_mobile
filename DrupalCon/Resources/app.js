// Declaring variables to prevent implied global error in jslint
var Ti, Titanium, Drupal, desc, menu, refresh, logout;

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// Include the Drupal connection libraries.
Ti.include(
  "drupal/drupal.js",
  "drupal/services.js",
  "drupal/db.js",
  "drupal/entity.js"
  // "lib/twitter_services.js"
);

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


// This is just for testing purposes. In practice we wouldn't
// actually want to wipe the DB on every app start. :-)
var store = Drupal.entity.db('main', 'node').initializeSchema();


Ti.include('windows/main.js');




/*
// Download tests, for now.  These must get moved eventually.
Drupal.db.errorMode = Drupal.db.ERROR_LEVEL_DEBUG;

// This is just for testing purposes. In practice we wouldn't
// actually want to wipe the DB on every app start. :-)
var store = Drupal.entity.db('main', 'node').initializeSchema();

//Drupal.entity.db('main', 'node').fetchUpdates('session');

//Drupal.entity.mirror('main', 'node', 464);

// This will actually not have the updated number of records,
// since the mirror request is asynchronous.
//Ti.API.info('Number of nodes on file: ' + Drupal.entity.db('main', 'node').connection.query("SELECT COUNT(*) FROM node").field(0));
*/
