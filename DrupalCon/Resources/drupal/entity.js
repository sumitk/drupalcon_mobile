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
        id: 'nid',
        revision: 'vid',
        bundle: 'type',
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

  db: function(key) {

    return new Drupal.entity.Datastore(key);
  },

  entityInfo: function(entity_type) {
    if (this.types[entity_type] != undefined) {
      return this.types[entity_type];
    }
    Ti.API.info('No such entity type defined: ' + entity_type);
  }

};

Drupal.entity.Datastore = function(key) {

  var conn = Drupal.entity.storage;
  this.db = conn.use(key);

  return this;
};

Drupal.entity.Datastore.prototype.save = function(entity_type, id) {
  var collection = this.db.collection(entity_type);

};

Drupal.entity.Datastore.prototype.load = function(entity_type, id) {

};



/*
var store = Drupal.entity.db('site');
var node = store.load('node', id);
var nodes = store.loadMultiple('node', ids);
store.save('node', node);
*/

// These kinda sorta serve as a unit test, ish, maybe, for now.

var store = Drupal.entity.db('site');

var node1 = {
  nid: 1,
  type: 'page',
  title: 'Hello world'
};

store.save('node', node1);

store.load('node', 1);

