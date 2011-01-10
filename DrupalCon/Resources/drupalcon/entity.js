

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

  getFieldValues: function(entity, values) {
    values.created = entity.created;
    values.changed = entity.changed;
  }
};

