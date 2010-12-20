
var Drupal = {
  setDefaults: function(settings, defaults) {
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key) && settings[key] == undefined) {
        settings[key] = defaults[key];
      }
    }
    return settings;
  },

  createConnection: function(settings) {
    var defaults = {
        endpointUrl: '',
        user: '',
        pass: ''
      };

    this.setDefaults(settings, defaults);
    Ti.API.info("Creating service object.");
    var service = new DrupalService(settings);
    Ti.API.info("Returning service object.");
    return service;
  }

};

function DrupalService(settings) {
  var defaults = {
    endpointUrl: '',
    user: '',
    pass: ''
  };

  this.settings = Drupal.setDefaults(settings, defaults);
  Ti.API.info(this.settings);
  this.loadHandler = this.defaultLoadHandler;
  this.errorHandler = this.defaultErrorHandler;
}

DrupalService.prototype.defaultErrorHandler = function(e) {
  Ti.API.info("ERROR " + e.error);
  alert(e.error);
};

DrupalService.prototype.defaultLoadHandler = function(e) {
  // This is a do nothing function. It's mostly here just so that there is always
  // a function defined somewhere.
  Ti.API.info("Data was loaded");
};

DrupalService.prototype.request = function(options) {

  var defaults = {
    errorHandler: this.errorHandler,
    loadHandler: this.loadHandler,
    method: 'GET',
    format: 'json'
  };

  Drupal.setDefaults(options, defaults);
  Ti.API.info(options);
  Ti.API.info("Creating http client.");
  var xhr = Titanium.Network.createHTTPClient();
  xhr.onerror = options.errorHandler;
  xhr.onload = options.loadHandler;

  //open the client and encode our URL
  var url = this.settings.endpointUrl + '/' + options.query + '.' + options.format;
  Ti.API.info("Opening connection.");
  xhr.open(options.method,url);

  // base64 encode our Authorization header
  //xhr.setRequestHeader('Authorization','Basic '+Ti.Utils.base64encode(username.value+':'+password.value));

  //send the data
  Ti.API.info("Sending request.");

  xhr.send();
};

