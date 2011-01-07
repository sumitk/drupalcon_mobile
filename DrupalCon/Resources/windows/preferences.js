var win = Titanium.UI.currentWindow;
var android = Ti.Platform.name == 'android';
var data = [];

var labelRow = Ti.UI.createTableViewRow();
var inputRow = Ti.UI.createTableViewRow();
var buttonRow = Ti.UI.createTableViewRow();

var titleLabel = Titanium.UI.createLabel({
    text:'Please enter your chicago2011.drupal.org username and password.',
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
  top: android ? 200 : 180,
  width:300,
  height: android ? 45 : 40
});
buttonRow.add(button);

data.push(labelRow);
data.push(inputRow);
data.push(buttonRow);

tableView = Titanium.UI.createTableView({ data:data });

win.add(tableView);

button.addEventListener('click',function(e){
  var pass = password.value ? password.value : 'no password';
  var user = username.value ? username.value : 'no username';
  Ti.API.info(user + ':' + pass);
  
  Titanium.App.Properties.setString("siteUsername",user);
  Titanium.App.Properties.setString("sitePassword",pass);
  Titanium.UI.createAlertDialog({title:'Preferences',message:'Your preferences have been saved.'}).show();
  messageLabel.text = 'Your preferences have been saved.';
	messageWin.open();
	setTimeout(function()
	{
    messageLabel.text = 'Your preferences have been saved.';
	},1000);

	setTimeout(function()
	{
		messageWin.close({opacity:0,duration:500});
	},2000);
  win.close();

});