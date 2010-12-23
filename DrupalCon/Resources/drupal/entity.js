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

  /**
   * A TiStorage object.
   *
   * Because creating the storage object involves deserialization, we'll do it
   * once and then never try to do it again.  At least for this library.
   */
  storage: TiStorage(),

  db: function(database, entityType) {

    var collection = this.storage.use(database).collection(entityType);

    return new Drupal.entity.Datastore(collection, entityType);
  },

  entityInfo: function(entityType) {
    if (this.types[entityType] != undefined) {
      return this.types[entityType];
    }
    Ti.API.info('No such entity type defined: ' + entityType);
  }
};

Drupal.entity.Datastore = function(collection, entityType) {

  this.collection = collection;
  this.entityType = entityType;

  return this;
};

Drupal.entity.Datastore.prototype.getIdField = function() {
  var idField = Drupal.entity.types[this.entityType].entity_keys.id;

  return idField;
};

Drupal.entity.Datastore.prototype.save = function(entity) {

  var idField = this.getIdField();
  var idObject = {};
  idObject[idField] = entity[idField];

  Ti.API.info(idObject);

  trc.Debug(entity);

  Ti.API.info('Checking for existing object.');
  if (this.collection.exists(idObject)) {
    Ti.API.info('Object already exists.');
    this.collection.update(idObject, entity);
  }
  else {
    Ti.API.info('Object did not exist.');
    this.collection.create(entity);
  }

};

Drupal.entity.Datastore.prototype.load = function(id) {

  var idField = this.getIdField();
  var idObject = {};
  idObject[idField] = id;

  var entities = this.collection.findOne(idObject);

  return entities;
};

/**
 * Remove an entity from the collection.
 *
 * This would be called delete(), but that's a reserved word in Javascript.
 *
 * @param entityType
 * @param id
 */
Drupal.entity.Datastore.prototype.remove = function(id) {

  var idField = this.getIdField();
  var idObject = {};
  idObject[idField] = id;

  this.collection.remove(idObject);

};



/*
var store = Drupal.entity.db('site');
var node = store.load('node', id);
var nodes = store.loadMultiple('node', ids);
store.save('node', node);
*/

// These kinda sorta serve as a unit test, ish, maybe, for now.

try {
  trc.Begin('app.js');

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

  store.remove(1);

}
catch(e) {
    trc.SetMessage(e.name, e.message, trc);
}

if (trc.IsError()) {
    trc.Show();
}
