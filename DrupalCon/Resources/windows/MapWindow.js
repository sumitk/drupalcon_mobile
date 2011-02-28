
(function() {

  var uiEnabled = true;

  DrupalCon.ui.createMapWindow = function(tabGroup) {
    var mapWindow = Titanium.UI.createWindow({
      id: 'mapWindow',
      title: 'Sheraton Maps',
      backgroundColor: '#FFF',
      tabGroup: tabGroup
    });

    // create table view data object
    var data = [
      {title: 'Level 1 - Exhibit Hall',info:true, hasChild:true, backgroundSelectedColor:'#0779BE', color: '#000', image:'images/maps/level1.png'},
      {title: 'Level 2 - Meeting Rooms', hasChild:true, backgroundSelectedColor:'#0779BE', color: '#000', image:'images/maps/level2.png'},
      {title: 'Level 3 - Lobby', hasChild:true, backgroundSelectedColor:'#0779BE', color: '#000', image:'images/maps/level3.png'},
      {title: 'Level 4 - Ballroom', hasChild:true, backgroundSelectedColor:'#0779BE', color: '#000', image:'images/maps/level4.png'}
    ];

    // create table view
    var tableview = Titanium.UI.createTableView({
      data: data
    });

    // add table view to the window
    mapWindow.add(tableview);

    mapWindow.addEventListener('focus', function() {
      uiEnabled = true;
    });

    // create table view event listener
    tableview.addEventListener('click', function(e) {
      var mapImage = Ti.UI.createImageView({
        image: e.rowData.image
      });

      var map = Ti.UI.createWindow({
        title: e.rowData.title
      });

      map.add(mapImage);
      if (uiEnabled) {
        uiEnabled = false;
        var currentTab = (Ti.Platform.name == 'android') ? Titanium.UI.currentTab : mapWindow.tabGroup.activeTab;
        currentTab.open(DrupalCon.ui.createMapDetailWindow({
          title: e.rowData.title,
          mapName: e.rowData.title,
          image: e.rowData.image,
          info: e.rowData.info,
          tabGroup: currentTab
        }), {animated:true});
      }
    });


    return mapWindow;
  };

})();
