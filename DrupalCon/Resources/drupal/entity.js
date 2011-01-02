// Include the main Drupal library.
if (!Drupal) {
  Ti.include('drupal.js');
}

if (!Drupal.db) {
  Ti.include('db.js');
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

  /**
   * Creates a new entity storage object.
   *
   * @param string site
   *   A key for the site from which we are mirroring 
   *   content. This corresponds to the database we are
   *   loading.
   * @param string entityType
   *   The type of entity (node, user, etc.) that we are
   *   accessing.
   * @return
   *   A new datastore object for the specified site and entity.
   */
  db: function(site, entityType) {
    var conn = Drupal.db.openConnection(site);

    return new Drupal.entity.Datastore(conn, entityType);
  },

  /**
   * Retrieves information about a defined entity.
   *
   * @param entityType
   *   The type of entity for which we want information.
   * @return Object
   *   The entity definition as an object/associative array,
   *   or null if not found.
   */
  entityInfo: function(entityType) {
    if (this.types[entityType] !== undefined) {
      return this.types[entityType];
    }
    Ti.API.info('No such entity type defined: ' + entityType);
  }
};

/**
 * Creates a Drupal Datastore object.
 *
 * A datastore object serves as a repository for loading
 * and saving cached entities.  Although it uses SQLite
 * under the hood, it's not truly accessible as an SQL engine.
 *
 * @param Ti.Database.DB connection
 *   The database connection object for this datastore.
 * @param string
 *   The type of entity this datastore should access.
 * @return {Datastore}
 */
Drupal.entity.Datastore = function(connection, entityType) {

  this.connection = connection;
  this.entityType = entityType;

  this.idField = this.getIdField();

  return this;
};

/**
 * Returns the name of the field that holds the primary key for entities of this type.
 *
 * @return string
 *   The name of the field that holds this entity type's primary key.
 */
Drupal.entity.Datastore.prototype.getIdField = function() {
  var idField = Drupal.entity.types[this.entityType].entity_keys.id;

  return idField;
};

/**
 * Saves an entity into the local database.
 *
 * Note that although we allow saving of new entities,
 * a primary key is required. One will not be created
 * automatically and the query will fail if one is not
 * defined.
 *
 * @param object entity
 *   A Drupal entity to save.  This should be an untyped
 *   object.  It is (or should be) safe to simply use an 
 *   entity object retrieved from a Drupal site.
 */
Drupal.entity.Datastore.prototype.save = function(entity) {
  if (this.exists(entity[this.idField])) {
    return this.update(entity);
  }
  else {
    return this.insert(entity);
  }
};

/**
 * Inserts a new entity into the local database.
 *
 * @param object entity
 *   A Drupal entity to insert.  This should be an untyped
 *   object.  It is (or should be) safe to simply use an 
 *   entity object retrieved from a Drupal site.
 * @return integer
 *   The number of rows affected. This should only ever be 1 for 
 *   a successful insert or 0 if something went wrong.
 */
Drupal.entity.Datastore.prototype.insert = function(entity) {
  var data = Ti.JSON.stringify(entity);
  this.connection.insert(this.entityType).fields({
    nid: entity[this.idField],
    type: entity.type,
    title: entity.title,
    data: data
  }).execute();
  
  return this.connection.rowsAffected;
};

/**
 * Updates an existing entity in the local database.
 *
 * Note: if the specified object does not already exist, 
 * it will not be saved.  To ensure that an object
 * is saved properly call the save() method instead.
 *
 * @param object entity
 *   A Drupal entity to update.  This should be an untyped
 *   object.  It is (or should be) safe to simply use an
 *   entity object retrieved from a Drupal site.
 * @return integer
 *   The number of rows affected. This should only ever be 1 for
 *   a successful update or 0 if the entity didn't exist in the
 *   first place.
 */
Drupal.entity.Datastore.prototype.update = function(entity) {
  var data = Ti.JSON.stringify(entity);
  this.connection.query("UPDATE " + this.entityType + " SET type=?, title=?, data=? WHERE nid=?", [entity.type, entity.title, data, entity[this.idField]]);
  return this.connection.rowsAffected;
};

/**
 * Determines if an entity with the given ID already exists.
 *
 * The ID is localized to the keyspace of this datastore's
 * site and entity type.
 *
 * @param integer id
 *   The ID of the entity to check.
 * @return boolean
 *   true if an entity with the specified ID exists, false
 *   if not or if there was an error.
 */
Drupal.entity.Datastore.prototype.exists = function(id) {
  var rows = this.connection.query("SELECT 1 FROM " + this.entityType + " WHERE " + this.idField + " = ?", [id]);

  // In case of pretty much any error whatsoever, Ti will just
  // return null rather than show a useful error.  So we have
  // to check the return, always. Fail.  We'll assume that a
  // null return (error) indicates that the record is not there.
  return rows && rows.rowCount;
};

/**
 * Loads a single entity from the datastore.
 *
 * @param integer id
 *   The ID of the entity to load.
 * @return object
 *   The entity with the specified ID if any, or null
 *   if one was not found.
 */
Drupal.entity.Datastore.prototype.load = function(id) {
  var entities = this.loadMultiple([id]);

  if (entities && entities[0]) {
    return entities[0];
  }
  else {
    Ti.API.info('No data found.');
    return null;
  }
};

/**
 * Loads multiple entities from the datastore.
 *
 * @todo Figure out some way to control the order
 *   in which the entities are returned.
 * @param Array ids
 *   An array of entity IDs to load.
 * @return Array
 *   An array of loaded entity objects.  If none were found
 *   the array will be empty. Note that the order of entities
 *   in the array is undefined.
 */
Drupal.entity.Datastore.prototype.loadMultiple = function(ids) {

  var entities = [];

  var numPlaceholders = ids.length;
  var placeholders = [];
  for (var i=0; i < numPlaceholders; i++) {
    placeholders.push('?');
  }

  var rows = this.connection.query('SELECT data FROM ' + this.entityType + ' WHERE ' + this.idField + ' IN (' + placeholders.join(', ') + ')', ids);

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
 * Remove an entity from the datastore.
 *
 * This would be called delete(), but that's a reserved word
 * in Javascript.
 *
 * Note that removing an entity from the local datastore does
 * not remove it from the site being mirrored. It only removes
 * the local copy.
 *
 * @param integer id
 *   The ID of the entity to remove.
 * @return integer
 *   The number of rows affected. This should only ever be 1 for 
 *   a successful deletion or 0 if the entity didn't exist in the
 *   first place.
 */
Drupal.entity.Datastore.prototype.remove = function(id) {
  this.connection.query("DELETE FROM " + this.entityType + " WHERE " + this.idField + " = ?", [id]);

  return this.connection.rowsAffected;
};


//These kinda sorta serve as a unit test, ish, maybe, for now.


function resetTest() {
  Drupal.db.addConnectionInfo('default');
  
  var conn = Drupal.db.openConnection('default');

  //Reset for testing.
  conn.remove();

  conn.close();

  var conn2 = Drupal.db.openConnection('default');

  conn2.query("CREATE TABLE IF NOT EXISTS node (" +
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

var ret;

Ti.API.info('Inserting node.');
ret = store.insert(node1);
Ti.API.info('Insert new entity returned: ' + ret);

ret = store.save(node2);
Ti.API.info('Save on new entity returned: ' + ret);

var count = store.connection.query('SELECT COUNT(*) FROM node').field(0);
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
ret = store.save(node);
Ti.API.info('Save on existing entity returned: ' + ret);

var nodeB = store.load(1);
Ti.API.info(nodeB);

Ti.API.info('Try to delete a node now.');
ret = store.remove(1);
Ti.API.info('Removing existing entity returned: ' + ret);

var count = store.connection.query('SELECT COUNT(*) FROM node').field(0);
Ti.API.info('There should be 1 record.  There are actually: ' + count);


/*
var store = Drupal.entity.db('site');
var node = store.load('node', id);
var nodes = store.loadMultiple('node', ids);
store.save('node', node);
*/



