
(function() {

  DrupalCon.ui.createMapWindow = function(tabGroup) {
    var mapWindow = Titanium.UI.createWindow({
      id: 'mapWindow',
      title: 'Maps',
      backgroundColor: '#FFF',
      tabGroup: tabGroup
    });

    mapWindow.add(Titanium.UI.createLabel({
      text: 'Map goes here',
      height: 50,
      width: 300,
      color: '#FFF',
      backgroundColor: '#000',
      top: 10,
      textAlign:' left',
      font: {fontSize: 18}
    }));

    return mapWindow;
  };

})();
