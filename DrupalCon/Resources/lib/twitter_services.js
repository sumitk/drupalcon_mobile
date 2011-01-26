// Declaring variables to prevent implied global error in jslint
var Ti;

// Check for new tweets
setInterval (function() {
  var screen_name = 'drupalcon';
  var net = Titanium.Network;
  var up = net.online;
  
  // Only check if the network is up.
  if (up) {
    Ti.API.info("In the up portion of the setInterval twitter check.");
    var xhr = Ti.Network.createHTTPClient();
    xhr.timeout = 1000;
    xhr.open("GET","http://api.twitter.com/1/statuses/user_timeline.json?screen_name="+screen_name+"&count=1");
    xhr.onload = function()
    {
      try
      {
        var tweets = eval('('+this.responseText+')');
        for (var c=0;c<tweets.length;c++){
          var tweet = tweets[c].text;
        }
        // Updated?  Then tell the world about it!
        var lastTweet = Titanium.App.Properties.getString("lastTweet");
        if (tweet != lastTweet) {
          var n = Ti.UI.createNotification({message:"New @drupalcon tweets!"});
          n.duration = Ti.UI.NOTIFICATION_DURATION_LONG;
          n.offsetX = 50;
          n.offsetY = 25;
          n.show();
        }
   			Titanium.App.Properties.setString("lastTweet",tweet);
      }
      catch(E){
        alert(E);
      }
    };
   	xhr.send();
	}
},1000);