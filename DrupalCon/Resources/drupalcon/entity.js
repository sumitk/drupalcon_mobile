

// Define our entity storage rules.

Drupal.entity.sites.main.types.node.schema = {
  fields: function() {
    return {
      fields: {
        changed: {
          type: 'INTEGER'
        }
      },
      indexes: {
        'node_changed': ['changed']
      }
    };
  },

  getFieldValues: function(entity, values) {
    //values.created = entity.created;
    values.changed = entity.changed;
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
  defaultFetcher: function(bundle, store) {
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
    };

    //open the client and encode our URL
    var url = 'http://chicago2011.drupal.org/mobile/fetch/' + bundle;
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
  defaultFetcher: function(bundle, store) {
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
    };

    //open the client and encode our URL
    var url = 'http://chicago2011.drupal.org/mobile/fetch/presenters?junk=' + Math.random();
    xhr.open('GET', url);

    //send the data
    Ti.API.debug("Sending request.");

    xhr.send();
  }
};

