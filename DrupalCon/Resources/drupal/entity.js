// Include the main Drupal library.
if (!Drupal) {
  Ti.include('drupal.js');
}

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
  Ti.API.info('Checking for existing object.');
  if (this.exists(entity[this.idField])) {
    Ti.API.info('Object already exists.');
    this.update(entity);
    //this.connection.update(idObject, entity);
  }
  else {
    Ti.API.info('Object did not exist.');
    this.insert(entity);
  }
};

Drupal.entity.Datastore.prototype.insert = function(entity) {
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
  var rows = this.connection.execute("SELECT 1 FROM " + this.entityType + " WHERE " + this.idField + " = ?", [id]);
  
  // In case of pretty much any error whatsoever, Ti will just
  // return null rather than show a useful error.  So we have
  // to check the return, always. Fail.  We'll assume that a 
  // null return (error) indicates that the record is not there.
  return rows && rows.rowCount;
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


/* -----------------------------------------------

var db = Titanium.Database.open('mydb');

db.execute('CREATE TABLE IF NOT EXISTS DATABASETEST  (ID INTEGER, NAME TEXT)');
db.execute('DELETE FROM DATABASETEST');

db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',1,'Name 1');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',2,'Name 2');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',3,'Name 3');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)',4,'Name 4');
db.execute('INSERT INTO DATABASETEST (ID, NAME ) VALUES(?,?)', 5, '\u2070 \u00B9 \u00B2 \u00B3 \u2074 \u2075 \u2076 \u2077 \u2078 \u2079');
var updateName = 'I was updated';
var updateId = 4;
db.execute('UPDATE DATABASETEST SET NAME = ? WHERE ID = ?', updateName, updateId);

db.execute('UPDATE DATABASETEST SET NAME = "I was updated too" WHERE ID = 2');

db.execute('DELETE FROM DATABASETEST WHERE ID = ?',1);

Titanium.API.info('JUST INSERTED, rowsAffected = ' + db.rowsAffected);
Titanium.API.info('JUST INSERTED, lastInsertRowId = ' + db.lastInsertRowId);

var rows = db.execute('SELECT * FROM DATABASETEST');
Titanium.API.info('ROW COUNT = ' + rows.getRowCount());
Titanium.API.info('ROW COUNT = ' + rows.getRowCount());
Titanium.API.info('ROW COUNT = ' + rows.getRowCount());

while (rows.isValidRow())
{
    Titanium.API.info('ID: ' + rows.field(0) + ' NAME: ' + rows.fieldByName('name') + ' COLUMN NAME ' + rows.fieldName(0));
    if (rows.field(0)==5)
    {
        Ti.API.info(rows.fieldByName('name'));
    }

    rows.next();
}
rows.close();
db.close(); // close db when you're done to save resources

// ---------------------------------------------
*/


function resetTest() {
  var conn = Ti.Database.open('default');

  //Reset for testing.
  conn.remove();
  
  conn.close();
  
  var conn2 = Ti.Database.open('default');
  
  conn2.execute("CREATE TABLE IF NOT EXISTS node (" +
   "nid INTEGER PRIMARY KEY," +
   "vid INTEGER," +
   "type VARCHAR," +
   "title VARCHAR," +
   "created INT," +
   "changed INT," +
   "data BLOB)");
  
}


resetTest();

var node1 = {
    nid: 1,
    type: 'page',
    title: 'Hello world'
  };

var node2 = {
    nid: 2,
    type: 'page',
    title: 'Goodbye world'
  };

var store = Drupal.entity.db('default', 'node');

Ti.API.info('Inserting node.');
store.insert(node1);
store.insert(node2);

Ti.API.info('Selecting whole table');
var c = store.connection;

Ti.API.info(c.toString());

var rows = c.execute('SELECT * FROM node');

Ti.API.info(rows);

if (rows) {
  Ti.API.info(rows.toString());
}


Ti.API.info('Row count: ' + rows.getRowCount());
while (rows.isValidRow()) {
  Ti.API.info(rows.fieldByName('title'));
  rows.next();
}

Ti.API.info('Checking for record.');
if (store.exists(1)) {
  Ti.API.info('Record exists.');
}
else {
  Ti.API.info('Record does not exist.');
}




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
