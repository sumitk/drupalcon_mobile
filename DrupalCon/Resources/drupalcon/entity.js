

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
        },
        instructors: {
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

    // The room may be multi-value because some sessions, like keynotes, are in
    // multiple rooms.  So we fold the denormalized value down to a string, and
    // convert the data blob version to an array so that we don't have to deal
    // with type checking it later.
    if (typeof entity.room !== undefined) {
      var rooms = [];
      if (typeof entity.room === 'string') {
        rooms.push(entity.room);
      }
      else if (typeof entity.room === 'object') {
        for (var key in entity.room) {
          // We don't actually use hasOwnProperty() here because this is a
          // JSON-derived object, so it doesn't exist. I don't get it either.
          rooms.push(entity.room[key]);
        }
      }
      values.room = rooms.join(', ');
      entity.room = rooms;
    }

    if (entity.start_date) {
      var start_date = parseISO8601(entity.start_date + ':00');
      values.start_date = Drupal.getISODate(start_date);
    }

    if (entity.end_date) {
      var end_date = parseISO8601(entity.end_date + ':00');
      values.end_date = Drupal.getISODate(end_date);
    }

    // This is not really the right place for this sort of normalization, but
    // it's here so we'll use it.

    // On sessions, force the instructor and room fields to be collections.
    // That they may not be if single-value is a bug in the views_datasource
    // module.
    if (typeof entity.instructors !== undefined) {
      var instructors = [];
      if (typeof entity.instructors === 'string') {
        instructors.push(entity.instructors);
      }
      else if (typeof entity.instructors == 'object') {
        for (var insKey in entity.instructors) {
          // We don't actually use hasOwnProperty() here because this is a
          // JSON-derived object, so it doesn't exist. I don't get it either.
          instructors.push(entity.instructors[insKey]);
        }
      }
      entity.instructors = instructors;
      values.instructors = instructors.join(', ');
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
    // Set the base URL.
    var url = 'http://chicago2011.drupal.org/mobile/fetch/' + bundle;

    //Only get those nodes that have been updated since we last requested an update.
    // This is bound to the view we're pulling from and configured there.
    // Note that we're using an ISO date rather than a unix timestamp because
    // the view doesn't work with a timestamp for some odd reason.
    var lastUpdated = Titanium.App.Properties.getString('drupalcon:fetcher:lastNodeUpdate:' + bundle, '');
    url += '?changed=' + lastUpdated;

    this.prototype.defaultFetcher.apply(this, [bundle, store, func, url]);

    // We need the date in UTC format, because that's what Drupal uses on its
    // side for the updated timestamp.
    Ti.App.Properties.setString('drupalcon:fetcher:lastNodeUpdate:' + bundle, Drupal.getISODate(new Date(), true));
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

    // We always need a full name field for display, so normalize it here
    // rather than on display.
    if (entity.full_name) {
      values.full_name = entity.full_name;
    }
    else {
      values.full_name = entity.name;
    }
    
    var dir = Ti.Filesystem.applicationDataDirectory;
    var f = Ti.Filesystem.getFile(dir,entity.picture);
    if(!f.exists()) {
      var xhr = Titanium.Network.createHTTPClient();
      xhr.onload = function() {
        dpm(entity.picture);
        f.write(this.responseData);
      };
      xhr.open('GET', entity.picture);
      xhr.send();
    }

//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-11144.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-184.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-169.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1529.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-189.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-194.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-209.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-224.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-229.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-234.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-239.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-244.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-464.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-169.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-164.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-259.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-269.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-274.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-354.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-134.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-379.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-324.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-499.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-39.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-114.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-39.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-9.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-4.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-14.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-2899.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-119.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-9019.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-5684.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-6184.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1684.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-589.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-13399.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-269.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-74.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-4869.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1744.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1349.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-2264.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-11059.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-12584.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-2519.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-3879.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-8279.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-26199.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-13924.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-17794.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-13924.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-5014.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-3054.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-14364.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-7179.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-2539.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-5679.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-5684.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-14329.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-26199.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1489.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-414.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-13974.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-189.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-13034.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-11509.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-8649.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-14729.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-15059.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-11144.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-14774.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1744.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1814.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-13399.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-589.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-639.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-14134.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-3124.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-8249.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-6864.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-9164.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-3159.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1029.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-6994.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-13884.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-74.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-13984.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-424.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-864.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-839.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-729.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-724.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-2134.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-664.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-149.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-639.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-14559.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-3729.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-14.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-244.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-26014.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-11669.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-5699.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1534.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-119.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-79.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-4.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-13034.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-15394.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-14959.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-15309.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-44.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1774.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-3489.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-11109.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-3924.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-409.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-31414.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1894.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-164.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-324.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-169.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-244.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-164.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1744.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-559.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1814.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1744.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-114.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-489.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-409.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-5839.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-39.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-8249.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-409.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-409.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/sites/all/default-profile-pic.png
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-1029.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-15714.jpg
//[INFO] http://chicago2011.drupal.org/sites/default/files/imagecache/mobile_presenter/pictures/picture-11144.jpg
  },

  /**
   * Retrieves updates for this entity type.
   *
   * @param {string} bundle
   *   The bundle type we want to retrieve.
   * @param {Drupal.entity.Datastore} store
   *   The datastore to which to save the retrieved entities.
   * @param {function} func
   *   A callback functino that will be called when the fetch is complete.
   */
  defaultFetcher: function(bundle, store, func) {
    this.prototype.defaultFetcher.apply(this, [bundle, store, func, 'http://chicago2011.drupal.org/mobile/fetch/presenters']);
  }

};

// This defines the "parent" class, kinda.  This allows us to share functionality
// between schemas, including defaults for functions/methods.
Drupal.entity.sites.main.types.user.schema.prototype = Drupal.constructPrototype(Drupal.entity.DefaultSchema);
