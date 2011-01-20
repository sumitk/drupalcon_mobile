

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
      var payload = this.responseText;
      var decoded = Ti.JSON.parse(payload);

      var nodes = decoded.nodes;

      Ti.API.info(payload);

      for (var i=0; i < nodes.length; i++) {
        Ti.API.info(nodes[i].node.nid);
        //store.save(node);
      }

      //Ti.API.info(payload);
      //Ti.API.info(decoded);
    };

    //open the client and encode our URL
    var url = 'http://chicago2011.drupal.org/mobile/fetch/' + bundle;
    xhr.open('GET', url);

    //send the data
    Ti.API.info("Sending request.");

    xhr.send();
  }
};

