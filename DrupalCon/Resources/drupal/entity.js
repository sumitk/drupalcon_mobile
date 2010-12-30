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
  if (this.exists(entity[this.idField])) {
    this.update(entity);
  }
  else {
    Ti.API.info('Object did not exist.');
    this.insert(entity);
  }
};

Drupal.entity.Datastore.prototype.insert = function(entity) {
  var data = Ti.JSON.stringify(entity);
  this.connection.execute("INSERT INTO " + this.entityType + " (nid, type, title, data) VALUES (?, ?, ?, ?)", [entity[this.idField], entity.type, entity.title, data]);
};


Drupal.entity.Datastore.prototype.update = function(entity) {
  var data = Ti.JSON.stringify(entity);

  this.connection.execute("UPDATE " + this.entityType + " SET type=?, title=?, data=? WHERE nid=?", [entity.type, entity.title, data, entity[this.idField]]);
};

Drupal.entity.Datastore.prototype.exists = function(id) {
  var rows = this.connection.execute("SELECT 1 FROM " + this.entityType + " WHERE " + this.idField + " = ?", [id]);
  
  // In case of pretty much any error whatsoever, Ti will just
  // return null rather than show a useful error.  So we have
  // to check the return, always. Fail.  We'll assume that a 
  // null return (error) indicates that the record is not there.
  return rows && rows.rowCount;
};

Drupal.entity.Datastore.prototype.load = function(id) {
  entities = this.loadMultiple([id]);

  if (entities && entities[0]) {
    return entities[0];
  }
  else {
    Ti.API.info('No data found.');
    return null;
  }
};

Drupal.entity.Datastore.prototype.loadMultiple = function(ids) {
  
  var entities = [];

  var numPlaceholders = ids.length;
  var placeholders = [];
  for (var i=0; i < numPlaceholders; i++) {
    placeholders.push('?');
  }
  
  var rows = this.connection.execute('SELECT data FROM ' + this.entityType + ' WHERE ' + this.idField + ' IN (' + placeholders.join(', ') + ')', ids);
  
  
  if (rows) {
    while (rows.isValidRow()) {
      var data = rows.fieldByName('data');
      var entity = Ti.JSON.parse(data);
      entities.push(entity);
      
      rows.next();
    }
  }
  
  return entities;
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


//These kinda sorta serve as a unit test, ish, maybe, for now.


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
store.save(node2);

Ti.API.info('Selecting whole table');
var c = store.connection;

Ti.API.info(c.toString());

var count = c.execute('SELECT COUNT(*) FROM node').field(0);

Ti.API.info('There should be 2 records.  There are actually: ' + count);

Ti.API.info('Checking for record.');
if (store.exists(1)) {
  Ti.API.info('Record exists.');
}
else {
  Ti.API.info('Record does not exist.');
}

var loaded_node = store.load(1);

Ti.API.info(loaded_node);

Ti.API.info('Trying to load multiple nodes.');
var nodes = store.loadMultiple([2, 1]);

Ti.API.info('Checking returned nodes.');
for (var i = 0; i < nodes.length; i++) {
  Ti.API.info(nodes[i]);
}

var node = store.load(1);
node.title = "Hello, Drupal world.";
store.save(node);

var nodeB = store.load(1);
Ti.API.info(nodeB);


/*
var store = Drupal.entity.db('site');
var node = store.load('node', id);
var nodes = store.loadMultiple('node', ids);
store.save('node', node);
*/



