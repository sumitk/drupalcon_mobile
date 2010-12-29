// Include the main Drupal library.
if (!Drupal) {
  Ti.include('drupal.js');
}

// NOTE: Ti.Storage must already have been included.  Since we use relative
// paths I don't really know yet how to include it from here, so it's up to the
// including app to load it first.

/**
 * Define a new library for Drupal Entity storage.
 */
Drupal.entity = {

  /**
   * Entity types known to the system.
   *
   * This is a subset of the information provided in hook_entity_info(). We have
   * to specify it again here because we may not be dealing with Drupal 7 on
   * the other end.
   *
   * We're using lower_case variables here instead of camelCase so that they
   * exactly match the PHP variables.  That will make dynamic definition easier
   * later.
   *
   * @todo Make it possible to override this data with a direct pull of
   *       hook_entity_info() from a connected server.
   */
  types: {
    node: {
      label: Ti.Locale.getString('Node'),
      entity_keys: {
        id: 'nid',
        revision: 'vid',
        bundle: 'type',
        label: 'title'
      }
    },
    user: {
      label: Ti.Locale.getString('User'),
      entity_keys: {
        id: 'uid',
        bundle: null,
        label: 'name'
      }
    }
  },

  db: function(database, entityType) {

    var conn = Ti.Database.open(database);

    return new Drupal.entity.Datastore(conn, entityType);
  },

  entityInfo: function(entityType) {
    if (this.types[entityType] !== undefined) {
      return this.types[entityType];
    }
    Ti.API.info('No such entity type defined: ' + entityType);
  }
};

Drupal.entity.Datastore = function(connection, entityType) {

  this.connection = connection;
  this.entityType = entityType;

  this.idField = this.getIdField();
  
  return this;
};

Drupal.entity.Datastore.prototype.getIdField = function() {
  var idField = Drupal.entity.types[this.entityType].entity_keys.id;

  return idField;
};

Drupal.entity.Datastore.prototype.save = function(entity) {
  trc.Debug(entity);

  Ti.API.info('Checking for existing object.');
  if (this.exists(entity[this.idField])) {
    Ti.API.info('Object already exists.');
    this.update(entity);
    //this.connection.update(idObject, entity);
  }
  else {
    Ti.API.info('Object did not exist.');
    this.create(entity);
  }
};

Drupal.entity.Datastore.prototype.create = function(entity) {
  Ti.API.info('Inserting new object.');

  var data = Ti.JSON.stringify(entity);

  this.connection.execute("INSERT INTO " + this.entityType + " (nid, type, title, data) VALUES (?, ?, ?, ?)", [entity[this.idField], entity.type, entity.title, data]);
};


Drupal.entity.Datastore.prototype.update = function(entity) {
  Ti.API.info('Updating existing object.');

  var data = Ti.JSON.stringify(entity);

  this.connection.execute("UPDATE " + this.entityType + " SET type=?, title=?, data=? WHERE nid=?", [entity.type, entity.title, data, entity[this.idField]]);
};

Drupal.entity.Datastore.prototype.exists = function(id) {
  Ti.API.info('Checking for object existence...');
  var exists = this.connection.execute("SELECT 1 FROM " + this.entityType + " WHERE " + this.idField + " = ?", [id]).rowCount;
  
  Ti.API.info("Exists value: " + exists);
  
  return exists;
};

Drupal.entity.Datastore.prototype.load = function(id) {
  var rows = this.connection.execute('SELECT data FROM node WHERE nid=?', 1);
  
  if (rows.isValidRow()) {
    var data = rows.fieldByName('data');
    var node_loaded = Ti.JSON.parse(data);
    Ti.API.info(node_loaded);
  }
  else {
    Ti.API.info('No data found.');
  }
};

/**
 * Remove an entity from the collection.
 *
 * This would be called delete(), but that's a reserved word in Javascript.
 *
 * @param id
 */
Drupal.entity.Datastore.prototype.remove = function(id) {

  var idField = this.getIdField();
  var idObject = {};
  idObject[idField] = id;

  //this.collection.remove(idObject);

};


function resetTest() {
  var conn = Ti.Database.open('default');

  //Reset for testing.
  conn.remove();
  
  var conn2 = Ti.Database.open('default');
  
  conn2.execute("CREATE TABLE IF NOT EXISTS node " +
   "nid int(10) unsigned NOT NULL AUTO_INCREMENT," +
   "vid int(10) unsigned NOT NULL DEFAULT '0'," +
   "type varchar(32) NOT NULL DEFAULT ''," +
   "title varchar(255) NOT NULL DEFAULT ''," +
   "`created` int(11) NOT NULL DEFAULT '0'," +
   "`changed` int(11) NOT NULL DEFAULT '0'," +
   "data BLOB" +
   "PRIMARY KEY (`nid`)," +
   "UNIQUE KEY `vid` (`vid`)");
  
}


resetTest();

var node1 = {
    nid: 1,
    type: 'page',
    title: 'Hello world'
  };

Drupal.entity.db('default', 'node');

/*
// Insert
try {
  Ti.API.info('Inserting node.');

  var data = Ti.JSON.stringify(node1);
  
  // Check if the node exists already.
  var exists = conn.execute("SELECT nid FROM node WHERE nid = ?", [node1.nid]).rowCount;
  
  if (exists) {
    conn.execute("UPDATE node SET type=?, title=?, data=? WHERE nid=?", [node1.type, node1.title, data, node1.nid]);
  }
  else {
    conn.execute("INSERT INTO node (nid, type, title, data) VALUES (?, ?, ?, ?)", [node1.nid, node1.type, node1.title, data]);
  }
}
catch (e) {
  
}


// Check to see if it was created.
var rows = conn.execute("SELECT nid FROM node WHERE nid = ?", [node1.nid]);
Ti.API.info(rows);


if (exists) {
  Ti.API.info('Record exists.');
}
else {
  Ti.API.info('Record does not exist.');
}

// load
try {
  
  var rows = conn.execute('SELECT data FROM node WHERE nid=?', 1);
  
  if (rows.isValidRow()) {
    var data = rows.fieldByName('data');
    var node_loaded = Ti.JSON.parse(data);
    Ti.API.info(node_loaded);
  }
  else {
    Ti.API.info('No data found.');
  }
  
}
catch (e) {
  
}
*/

/*
KEY `node_type` (`type`(4)),
KEY `uid` (`uid`),
KEY `node_moderate` (`moderate`),
KEY `node_promote_status` (`promote`,`status`),
KEY `node_created` (`created`),
KEY `node_changed` (`changed`),
KEY `node_status_type` (`status`,`type`,`nid`),
*/

/*
var store = Drupal.entity.db('site');
var node = store.load('node', id);
var nodes = store.loadMultiple('node', ids);
store.save('node', node);
*/

// These kinda sorta serve as a unit test, ish, maybe, for now.

try {
  //trc.Begin('app.js');

  
  /*
  var conn = TiStorage();
  var db = conn.use('default');
  var store = db.collection('node');

  //var store = Drupal.entity.db('default', 'node');

  store.clear();

  var node1 = {
    id: 1,
    nid: 1,
    type: 'page',
    title: 'Hello world'
  };

  Ti.API.info('Inserting node.');
  store.create(node1);

  Ti.API.info('Checking for record.');
  if (store.exists({id: 1})) {
    Ti.API.info('Record exists.');
  }
  else {
    Ti.API.info('Record does not exist.');
  }
  */

  /*
  Ti.API.info('About to save this node.');
  Ti.API.info(node1);

  Ti.API.info('Saving node.');
  store.save(node1);

  Ti.API.info(node1);

  Ti.API.info('Loading node again.');
  var node1b = store.load(1);

  Ti.API.info('Showing loaded node.');
  Ti.API.info(node1b);
*/

  //store.remove(1);

}
catch(e) {
  //trc.SetMessage(e.name, e.message, trc);
}

//if (trc.IsError()) {
//  trc.Show();
//}
