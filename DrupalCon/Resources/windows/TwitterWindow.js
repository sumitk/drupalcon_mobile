var Twitter = {
  ui: {},
  util: {}
};

(function() {

  DrupalCon.ui.createTwitterWindow = function(tabGroup) {
    var twitterWindow = Titanium.UI.createWindow({
      id: 'twitterWindow',
      title: 'News',
      backgroundColor: '#FFF',
      tabGroup: tabGroup
    });

    // Trying out something a little different.  Why are we trying to create a
    // new twitter.com when we already have twitter.com?
    var webview = Ti.UI.createWebView({url:'http://mobile.twitter.com/drupalcon'});
    twitterWindow.add(webview);
    
    twitterWindow.addEventListener('focus', function() {
      var webview = Ti.UI.createWebView({url:'http://mobile.twitter.com/drupalcon'});
      twitterWindow.add(webview);
    });

    
    return twitterWindow;

//    // set up a twitter screen name.
//    var twitter_name = 'drupalcon';
//    twitterWindow.title = '@' + twitter_name;
//    var tweetCount = 50;
//
//    // set this to true if you are only tracking one user
//    var single = true;
//
//    var net = Titanium.Network;
//    var up = net.online;
//
//    function getTweets(screen_name) {
//      var actInd = Titanium.UI.createActivityIndicator({
//        bottom:10,
//        height:50,
//        width:10,
//        style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
//      });
//      actInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
//      actInd.font = {
//        fontFamily:'Helvetica Neue',
//        fontSize:15,
//        fontWeight:'bold'
//      };
//      actInd.color = 'white';
//      actInd.message = 'Loading...';
//      actInd.width = 210;
//      actInd.show();
//
//      // create table view data object
//      var data = [];
//
//      var xhr = Ti.Network.createHTTPClient();
//      xhr.timeout = 100000;
//      var tweetParams = "http://api.twitter.com/1/statuses/user_timeline.json?screen_name=" + screen_name + "&count=" + tweetCount;
//      xhr.open("GET", tweetParams);
//      xhr.onload = function() {
//        try {
//          var tweets = eval('('+this.responseText+')');
//          for (var c=0;c<tweets.length;c++) {
//            var tweet = tweets[c].text;
//            var user = tweets[c].user.screen_name;
//            var avatarWidth = 48;
//            var leftMargin = 54;
//            var rowHeight = 110;
//            var avatar = '';
//
//            // No need to load every single avatar if we are only looking at one user.
//            // Perhaps there is no need to load avatar at all?
//            if (single) {
//              //var avatar = tweets[0].user.profile_image_url;
//              avatarWidth = 0;
//              leftMargin = 5;
//              rowHeight = 'auto';
//            }
//            else {
//              avatar = tweets[c].user.profile_image_url;
//            }
//
//            var created_at = prettyDate(strtotime(tweets[c].created_at));
//            var bgcolor = (c % 2) === 0 ? '#fff' : '#eee';
//
//            var row = Ti.UI.createTableViewRow({
//              hasChild:true,
//              height:rowHeight,
//              backgroundColor:bgcolor
//            });
//
//            // Create a vertical layout view to hold all the info labels and images for each tweet
//            var post_view = Ti.UI.createView({
//              height:'auto',
//              layout:'vertical',
//              left:5,
//              top:5,
//              bottom:5,
//              right:5
//            });
//
//            var av = Ti.UI.createImageView({
//              image:avatar,
//              left:0,
//              top:0,
//              height:48,
//              width:avatarWidth
//            });
//            // Add the avatar image to the view
//            //post_view.add(av);
//
//            var user_label = Ti.UI.createLabel({
//              text:user,
//              left:leftMargin,
//              width:120,
//              top:1,
//              bottom:2,
//              height:16,
//              textAlign:'left',
//              color:'#444444',
//              font:{
//                fontFamily:'Trebuchet MS',
//                fontSize:14,
//                fontWeight:'bold'
//              }
//            });
//            // Add the username to the view
//            post_view.add(user_label);
//
//            var date_label = Ti.UI.createLabel({
//              text:created_at,
//              right:0,
//              top:5,
//              bottom:2,
//              height:14,
//              textAlign:'right',
//              width:110,
//              color:'#444444',
//              font:{
//                fontFamily:'Trebuchet MS',
//                fontSize:12
//              }
//            });
//            // Add the date to the view
//            post_view.add(date_label);
//
//            var tweet_text = Ti.UI.createLabel({
//              text:tweet,
//              left:leftMargin,
//              top:3,
//              bottom:2,
//              color:'#999999',
//              width:'auto',
//              height:'auto',
//              textAlign:'left',
//              font:{
//                fontSize:14
//              }
//            });
//            // Add the tweet to the view
//            post_view.add(tweet_text);
//            // Add the vertical layout view to the row
//            row.add(post_view);
//            row.className = 'item'+c;
//            data[c] = row;
//          }
//
//          Titanium.App.Properties.setString("lastTweet",tweet);
//
//          // Create the tableView and add it to the window.
//          var tableview = Titanium.UI.createTableView({
//            data:data,
//            minRowHeight:110
//          });
//          twitterWindow.add(tableview);
//          actInd.hide();
//
//          tableview.addEventListener('click', function(e) {
//            Ti.API.info(tweets[e.index].user.screen_name);
//          });
//        }
//        catch(e) {
//          Ti.API.info(e);
//        }
//      };
//      // Get the data
//      xhr.send();
//    }
//
//    // Get the tweets for 'twitter_name'
//    if (up) {
//      getTweets(twitter_name);
//
//      // Refresh menu item
//
//      // WTF?  Why doesn't this work?
//      /*
//      var buttons = [];
//      buttons.push({
//        title: "Refresh Tweets",
//        clickevent: function () {
//          getTweets(twitter_name);
//        }
//      });
//      menu.init({
//        win: twitterWindow,
//        buttons: buttons
//      });
//      */
//
//      if (Ti.Platform.name == 'android') {
//        twitterWindow.activity.onCreateOptionsMenu = function(e) {
//          var menu = e.menu;
//
//          var m1 = menu.add({
//            title : 'Refresh Tweets'
//          });
//          m1.addEventListener('click', function(e) {
//            getTweets(twitter_name);
//          });
//        };
//      }
//      else {
//        //create iphone menu.
//        var index = 0;
//        var button = Ti.UI.createButton({
//          systemButton: Ti.UI.iPhone.SystemButton.REFRESH
//
//        });
//        twitterWindow.rightNavButton = button;
//        button.addEventListener('click', function(e) {
//          getTweets(twitter_name);
//        });
//      }
//    }
//    else {
//      Ti.API.info("No active network connection.  Please try again when you are connected.");
//    }
//
//    return twitterWindow;
  };

})();

