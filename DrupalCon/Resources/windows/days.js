// create table view data object
var data = [
	{title:'Monday, March 7', hasChild:true,selectedColor:'#fff', date:'2011-2-7 00:00:00'},
	{title:'Tuesday, March 8', hasChild:true,selectedColor:'#fff', date:'2011-2-8 00:00:00'},
	{title:'Wednesday, March 9', hasChild:true,selectedColor:'#fff', date:'2011-2-9 00:00:00'},
	{title:'Thursday, March 10', hasChild:true,selectedColor:'#fff', date:'2011-2-10 00:00:00'},
  {title:'Friday, March 11', hasChild:true,selectedColor:'#fff', date:'2011-2-11 00:00:00'}
];

// create table view
var tableview = Titanium.UI.createTableView({
	data:data
});

// create table view event listener
tableview.addEventListener('click', function(e)
{
  Ti.API.info(e.rowData);
	// event data
	var index = e.index+1;
  var date = e.rowData.date;
	Ti.API.info('detail ' + e.rowData.date);
  var win = Titanium.UI.createWindow({
    url:'sessions.js',
    title:e.rowData.title,
    date:date
  });
  Titanium.UI.currentTab.open(win,{animated:true});
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);
