
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
      if (defaults.hasOwnProperty(key) && settings[key] === undefined) {
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
  return new f();
};

Drupal.getISODate = function(date) {
  return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
};

Drupal.getObjectKeys = function(o) {
  var ret = [];
  for (var key in o) {
    //if (o.hasOwnProperty(key)) {
      ret.push(key);
    //}
  }

  return ret;
};

Drupal.createNoticeDialog = function(message) {
  return new Drupal.NoticeDialog(message);
};

Drupal.NoticeDialog = function(message) {

  var messageWin = Titanium.UI.createWindow({
    height:30,
    width:250,
    bottom:70,
    borderRadius:10,
    border: 1,
    touchEnabled:false,
    orientationModes : [
      Titanium.UI.PORTRAIT,
      Titanium.UI.UPSIDE_PORTRAIT,
      Titanium.UI.LANDSCAPE_LEFT,
      Titanium.UI.LANDSCAPE_RIGHT,
    ]
  });
  var messageView = Titanium.UI.createView({
    id:'messageview',
    height:30,
    width:250,
    borderRadius:10,
    backgroundColor:'#000',
    opacity:0.7,
    touchEnabled:false
  });

  var messageLabel = Titanium.UI.createLabel({
    id:'messagelabel',
    text:'',
    color:'#fff',
    width:250,
    height:'auto',
    font:{
      fontFamily:'Helvetica Neue',
      fontSize:13
    },
    textAlign:'center'
  });

  messageLabel.text = message;

  messageWin.add(messageView);
  messageWin.add(messageLabel);

  this.messageWindow = messageWin;

};

Drupal.NoticeDialog.prototype.show = function(time) {
  this.messageWindow.open();

  // Needed to avoid 'this' confusion in the callback. Blech.
  var win = this.messageWindow;
  setTimeout(function() {
    win.close({opacity:0,duration:2000});
  }, time);
};
