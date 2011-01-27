

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
        //if (entity.room.hasOwnProperty(key)) {
          rooms.push(entity.room[key]);
        //}
      }
      values.room = rooms.join(', ');
    }

    if (entity.start_date) {
      Ti.API.info('Raw start date: ' + entity.start_date);
      var start_date = new Date(entity.start_date);
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
    var url = 'http://chicago2011.drupal.org/mobile/fetch/' + bundle + '?junk=' + Math.random();
    xhr.open('GET', url);

    //send the data
    Ti.API.debug("Sending request.");

    xhr.send();
  }
};

