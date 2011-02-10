
(function() {

  var uiEnabled = true;

  DrupalCon.ui.createDayWindow = function(tabGroup) {

    // create table view data object
    var data = [
      //{title:'Monday, March 7', hasChild:true, color:'#000', backgroundColor:'#fff', backgroundSelectedColor:'#0779BE', start_date:'2011-03-07T00:00:00', end_date:'2011-03-08T00:00:00'},
      {title:'Tuesday, March 8', hasChild:true, color:'#000', backgroundColor:'#fff', backgroundSelectedColor:'#0779BE', start_date:'2011-03-08T00:00:00', end_date:'2011-03-09T00:00:00'},
      {title:'Wednesday, March 9', hasChild:true, color:'#000', backgroundColor:'#fff', backgroundSelectedColor:'#0779BE', start_date:'2011-03-09T00:00:00', end_date:'2011-03-10T00:00:00'},
      {title:'Thursday, March 10', hasChild:true, color:'#000', backgroundColor:'#fff', backgroundSelectedColor:'#0779BE', start_date:'2011-03-10T00:00:00', end_date:'2011-03-11T00:00:00'}
      //{title:'Friday, March 11', hasChild:true, color:'#000', backgroundColor:'#fff', backgroundSelectedColor:'#0779BE', start_date:'2011-03-11T00:00:00', end_date:'2011-03-12T00:00:00'}
    ];

    var dayWindow = Titanium.UI.createWindow({
      id: 'win1',
      title: 'Sessions',
      backgroundColor: '#fff',
      tabGroup: tabGroup
    });

    // create table view
    var tableview = Titanium.UI.createTableView({
      data: data
    });

    // add table view to the window
    dayWindow.add(tableview);

    dayWindow.addEventListener('focus', function() {
      uiEnabled = true;
    });

    // create table view event listener
    tableview.addEventListener('click', function(e) {
      if (uiEnabled) {
        uiEnabled = false;
        var currentTab = (Ti.Platform.name == 'android') ? Titanium.UI.currentTab : dayWindow.tabGroup.activeTab;
        currentTab.open(DrupalCon.ui.createSessionsWindow({
          title: e.rowData.title,
          start_date: e.rowData.start_date,
          end_date: e.rowData.end_date,
          tabGroup: Titanium.UI.currentTab
        }), {animated:true});
      }
    });

//    dayWindow.addEventListener('open', function() {
//      var buttons = [];
//      buttons.push({
//        title: "Update",
//        clickevent: function () {
//          Ti.fireEvent('drupalcon:update_data');
//        }
//      });
//      menu.init({
//        win: dayWindow,
//        buttons: buttons
//      });
//    });


    return dayWindow;
  };

})();
