
/**
 * Main Drupal factory.
 *
 * This object serves as a central router for Drupal integration.
 */
var Drupal = {

  /**
   * Sets default values for an object.
   *
   * This is similar to jQuery.extend() or PHP's += for arrays, and can be
   * used for much the same purpose.
   *
   * @param settings
   *   The object on which to set default values.  Note that this object will
   *   be modified directly.
   * @param defaults
   *   The default values to use for each key if the settings object does not
   *   yet have a value for that key.
   * @returns
   *   The settings object.
   */
  setDefaults: function(settings, defaults) {
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key) && settings[key] == undefined) {
        settings[key] = defaults[key];
      }
    }
    return settings;
  }
};

/**
 * For fancy-schmancy inheritance building.
 */
Drupal.constructPrototype = function(o) {
  var f = function() {};
  f.prototype = o.prototype;
  return new f;
};
