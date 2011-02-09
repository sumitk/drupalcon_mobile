
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
      {title:'Level 1', hasChild:true, backgroundSelectedColor:'#0779BE', image:'images/maps/level1.png'},
      {title:'Level 2', hasChild:true, backgroundSelectedColor:'#0779BE', image:'images/maps/level2.png'},
      {title:'Lobby Level', hasChild:true, backgroundSelectedColor:'#0779BE', image:'images/maps/level3.png'},
      {title:'Ballroom Level', hasChild:true, backgroundSelectedColor:'#0779BE', image:'images/maps/level4.png'}
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
        currentTab.open(map);
      }
    });


    return mapWindow;
  };

})();
