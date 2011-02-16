
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
      {title: 'Level One - Exhibit Hall', hasChild:true, backgroundSelectedColor:'#0779BE', image:'images/maps/level1.png'},
      {title: 'Level Two - Meeting Rooms', hasChild:true, backgroundSelectedColor:'#0779BE', image:'images/maps/level2.png'},
      {title: 'Level Three - Lobby', hasChild:true, backgroundSelectedColor:'#0779BE', image:'images/maps/level3.png'},
      {title: 'Level Four - Ballroom', hasChild:true, backgroundSelectedColor:'#0779BE', image:'images/maps/level4.png'}
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
          tabGroup: currentTab
        }), {animated:true});
      }
    });


    return mapWindow;
  };

})();
