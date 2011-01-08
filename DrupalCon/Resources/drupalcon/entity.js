

// Define our entity storage rules.

Drupal.entity.sites.main.types.node.schema = {
  fields: function() {
    return {
      fields: {
        created: {
          type: 'INTEGER'
        },
        changed: {
          type: 'INTEGER'
        }
      },
      indexes: {
        'node_changed': ['changed']
      }
    };
  },

  getFieldValues: function(entity) {
    var fields = {};

    fields.created = entity.created;
    fields.updated = entity.updated;

    return fields;
  }
};

