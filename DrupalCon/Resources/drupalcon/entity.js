

// Define our entity storage rules.

Drupal.entity.sites.main.types.node.schema = {

  bypassCache: true,

  fields: function() {
    return {
      fields: {
        changed: {
          type: 'INTEGER'
        },
        room: {
          type: 'VARCHAR'
        },
        start_date: {
          type: 'VARCHAR'
        },
        end_date: {
          type: 'VARCHAR'
        }
      },
      indexes: {
        'node_changed': ['changed'],
        'room_idx': ['room']
      }
    };
  },

  getFieldValues: function(entity, values) {
    //values.created = entity.created;
    values.changed = entity.changed;

    //Ti.API.info('Entity keys: ' + Drupal.getObjectProperties(entity).join(', '));

    // The room may be multi-value, so we fold it down to a single string.
    // This is because some sessions, like keynotes, are in multiple rooms.
    if (typeof entity.room == 'string') {
      values.room = entity.room;
    }
    else if (typeof entity.room == 'object') {
      var rooms = [];
      for (var key in entity.room) {
        // We don't actually use hasOwnProperty() here because this is a
        // JSON-derived object, so it doesn't exist. I don't get it either.
        rooms.push(entity.room[key]);
      }
      values.room = rooms.join(', ');
    }

    if (entity.start_date) {
      var start_date = parseISO8601(entity.start_date + ':00');
      values.start_date = Drupal.getISODate(start_date);
    }

    if (entity.end_date) {
      var end_date = parseISO8601(entity.end_date + ':00');
      values.end_date = Drupal.getISODate(end_date);
    }

  },

  fetchers: {
    room: function() {

    }

  },

  /**
   * Retrieves updates for this entity type.
   *
   * @param {string} bundle
   *   The bundle type we want to retrieve.
   * @param {Drupal.entity.Datastore} store
   *   The datastore to which to save the retrieved entities.
   * @param func
   *   A callback function to call after the fetching process has been completed.
   */
  defaultFetcher: function(bundle, store, func) {
    this.prototype.defaultFetcher.apply(this, [bundle, store, func, 'http://chicago2011.drupal.org/mobile/fetch/' + bundle]);
  }
};

// This defines the "parent" class, kinda.  This allows us to share functionality
// between schemas, including defaults for functions/methods.
Drupal.entity.sites.main.types.node.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);



Drupal.entity.sites.main.types.user.schema = {
  fields: function() {
    return {
      fields: {
        full_name: {
          type: 'VARCHAR'
        }
      },
      indexes: {
        full_name_idx: ['full_name'],
        name_idx: ['name']
      }
    };
  },

  getFieldValues: function(entity, values) {
    //values.created = entity.created;

    if (entity.full_name) {
      values.full_name = entity.full_name;
    }

  },

  /**
   * Retrieves updates for this entity type.
   *
   * @param string bundle
   *   The bundle type we want to retrieve.
   * @param Drupal.entity.Datastore store
   *   The datastore to which to save the retrieved entities.
   */
  defaultFetcher: function(bundle, store, func) {
    this.prototype.defaultFetcher.apply(this, [bundle, store, func, 'http://chicago2011.drupal.org/mobile/fetch/presenters']);
  }

};

// This defines the "parent" class, kinda.  This allows us to share functionality
// between schemas, including defaults for functions/methods.
Drupal.entity.sites.main.types.user.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);
