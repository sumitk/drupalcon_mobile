

// Define our entity storage rules.

Drupal.entity.sites.main.types.node.schema = {
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

    // The room is multi-value, so we fold it down to a single string.
    // This is because some sessions, like keynotes, are in multiple rooms.
    if (entity.room) {
      var rooms = [];
      for (var key in entity.room) {
        // We don't actually use hasOwnProperty() here because this is a
        // JSON-derived object, so it doesn't exist. I don't get it either.
        rooms.push(entity.room[key]);
      }
      values.room = rooms.join(', ');
    }

    if (entity.start_date) {
      Ti.API.info('Raw start date: ' + entity.start_date);
      var start_date = parseISO8601(entity.start_date);
      Ti.API.info('Start date: ' + start_date.toString());
      values.start_date = Drupal.getISODate(start_date);
    }

    if (entity.end_date) {
      var end_date = new Date(entity.end_date);
      //Ti.API.info('End date: ' + end_date.toString());
      values.start_date = Drupal.getISODate(end_date);
    }

    if (entity.nid == 389) {
      Ti.API.info(Drupal.getObjectKeys(entity).join(', '));
      Ti.API.info(values);
    }

  },

  fetchers: {
    room: function() {

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
    var xhr = Titanium.Network.createHTTPClient();
    //xhr.onerror = options.errorHandler;
    xhr.onload = function() {
      var nodes = Ti.JSON.parse(this.responseText).nodes;

      var length = nodes.length;

      Ti.API.debug('Downloading ' + length + ' nodes.');

      for (var i=0; i < length; i++) {
        Ti.API.debug('Downloading node: ' + nodes[i].node.nid);
        store.save(nodes[i].node);
      }

      // Call our post-completion callback.
      if (func) {
        func();
      }
    };

    //open the client and encode our URL
    var url = 'http://chicago2011.drupal.org/mobile/fetch/' + bundle + '?junk=' + Math.random();
    xhr.open('GET', url);

    //send the data
    Ti.API.debug("Sending request.");

    xhr.send();
  }
};


Drupal.entity.sites.main.types.user.schema = {
  fields: function() {
    return {
      fields: {
        full_name: {
          type: 'VARCHAR'
        }
      },
      indexes: {
        full_name_idx: ['full_name']
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
    var xhr = Titanium.Network.createHTTPClient();
    //xhr.onerror = options.errorHandler;
    xhr.onload = function() {
      var users = Ti.JSON.parse(this.responseText).users;

      var length = users.length;

      Ti.API.debug('Downloading ' + length + ' users.');

      for (var i=0; i < length; i++) {
        Ti.API.debug('Downloading user: ' + users[i].user.uid);
        store.save(users[i].user);
      }

      // Call our post-completion callback.
      if (func) {
        func();
      }
    };

    //open the client and encode our URL
    var url = 'http://chicago2011.drupal.org/mobile/fetch/presenters?junk=' + Math.random();
    xhr.open('GET', url);

    //send the data
    Ti.API.debug("Sending request.");

    xhr.send();
  }
};

