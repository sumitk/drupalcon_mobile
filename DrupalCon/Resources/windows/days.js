
(function() {

  var rootPath = '../../../../../../../../../../';
  Ti.include(
    rootPath + "drupal/drupal.js",
    rootPath + "drupal/services.js",
    rootPath + "drupal/db.js",
    rootPath + "drupal/entity.js"
  );


  Ti.API.info('Start of days.js: ' + Drupal.getObjectProperties(Drupal.db.connectionInfo));


  var win = Titanium.UI.currentWindow;

  // create table view data object
  var data = [
    {title:'Monday, March 7', hasChild:true, color:'#000', backgroundColor:'#fff', selectedColor:'#fff', start_date:'2011-03-07T00:00:00', end_date:'2011-03-08T00:00:00'},
    {title:'Tuesday, March 8', hasChild:true, color:'#000', backgroundColor:'#fff', selectedColor:'#fff', start_date:'2011-03-08T00:00:00', end_date:'2011-03-09T00:00:00'},
    {title:'Wednesday, March 9', hasChild:true, color:'#000', backgroundColor:'#fff', selectedColor:'#fff', start_date:'2011-03-09T00:00:00', end_date:'2011-03-10T00:00:00'},
    {title:'Thursday, March 10', hasChild:true, color:'#000', backgroundColor:'#fff', selectedColor:'#fff', start_date:'2011-03-10T00:00:00', end_date:'2011-03-11T00:00:00'},
    {title:'Friday, March 11', hasChild:true, color:'#000', backgroundColor:'#fff', selectedColor:'#fff', start_date:'2011-03-11T00:00:00', end_date:'2011-03-12T00:00:00'}
  ];

  // create table view
  var tableview = Titanium.UI.createTableView({
    data: data
  });

  // create table view event listener
  tableview.addEventListener('click', function(e) {
    // event data
    var index = e.index + 1;
    var start_date = e.rowData.start_date;
    var end_date = e.rowData.end_date;
    var win1 = Titanium.UI.createWindow({
      url: 'sessions.js',
      title: e.rowData.title,
      start_date: start_date,
      tabGroup: win.tabGroup,
      end_date: end_date
    });
    Titanium.UI.currentTab.open(win1, {animated:true});
  });

  // add table view to the window
  win.add(tableview);

})();
