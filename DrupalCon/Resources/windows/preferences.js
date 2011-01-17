// Declaring variables to prevent implied global error in jslint
var Ti;

var win = Titanium.UI.currentWindow;
var android = Ti.Platform.name == 'android';
var data = [];

var labelRow = Ti.UI.createTableViewRow();
var inputRow = Ti.UI.createTableViewRow();
var buttonRow = Ti.UI.createTableViewRow();

var titleLabel = Titanium.UI.createLabel({
    text:'Please enter your Drupal.org username and password.',
    height:'auto',
    width:300,
    color:'#eee',
    textAlign:'left',
    font:{fontSize:18},
    top:5
});
labelRow.add(titleLabel);

var username = Ti.UI.createTextField({
  autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
  width:300,
  top:5,
  height: android ? 45 : 35,
  borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
  hintText:'Username'
});
inputRow.add(username);

var password = Ti.UI.createTextField({
  autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
  width:300,
  top:android ? 65 : 55,
  height:android ? 45 : 35,
  borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
  passwordMask:true,
  hintText:'Password'
});
inputRow.add(password);

var button = Titanium.UI.createButton({
  title:'Save',
  width:300,
  height: android ? 45 : 40
});
buttonRow.add(button);

data.push(labelRow);
data.push(inputRow);
data.push(buttonRow);

var tableView = Titanium.UI.createTableView({
    data:data,
    top:20
    });

win.add(tableView);

button.addEventListener('click',function(e){
  var pass = password.value ? password.value : 'no password';
  var user = username.value ? username.value : 'no username';
  Ti.API.info(user + ':' + pass);
  
  Titanium.App.Properties.setString("siteUsername",user);
  Titanium.App.Properties.setString("sitePassword",pass);
    //
    //  TAB GROUP EVENTS
    //
    var messageWin = Titanium.UI.createWindow({
      height:30,
      width:250,
      top:270,
      borderRadius:10,
      touchEnabled:false,
    
//      orientationModes : [
//      Titanium.UI.PORTRAIT,
//      Titanium.UI.UPSIDE_PORTRAIT,
//      Titanium.UI.LANDSCAPE_LEFT,
//      Titanium.UI.LANDSCAPE_RIGHT
//      ]
    });
    var messageView = Titanium.UI.createView({
      id:'messageview',
      height:30,
      width:250,
      borderRadius:10,
      backgroundColor:'#fff',
      opacity:0.7,
      touchEnabled:false
    });
    
    var messageLabel = Titanium.UI.createLabel({
      id:'messagelabel',
      text:'',
      color:'#000',
      width:250,
      height:'auto',
      font:{
        fontFamily:'Helvetica Neue',
        fontSize:13
      },
      textAlign:'center'
    });
    messageWin.add(messageView);
    messageWin.add(messageLabel);

  messageLabel.text = 'Your preferences have been saved.';
	messageWin.open();
	setTimeout(function()
	{
    messageLabel.text = 'Your preferences have been saved.';
	},1000);

	setTimeout(function()
	{
		messageWin.close({opacity:0,duration:500});
    win.close();
	},2000);

});