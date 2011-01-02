
/**
 * Creates a Drupal Datastore object.
 *
 * A datastore object serves as a repository for loading
 * and saving cached entities.  Although it uses SQLite
 * under the hood, it's not truly accessible as an SQL engine.
 *
 * @param string site
 *   The site key to wich this datastore is bound.
 * @param Ti.Database.DB connection
 *   The database connection object for this datastore.
 * @param string
 *   The type of entity this datastore should access.
 * @return {Datastore}
 */
Drupal.entity.Datastore = function(site, connection, entityType) {

  this.site = site;
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
  var idField = Drupal.entity[this.site].types[this.entityType].entity_keys.id;

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
  // For simplicity, we'll just do a delete/insert cycle.
  // We're only using a very simple (if dynamic) schema,
  // so this lets us avoid having to write a dynamic
  // update builder for now.
  this.remove(entity[this.idField]);
  return this.insert(entity);
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
