
(function() {

  DrupalCon.ui.createStarredWindow = function(tabGroup) {
    var starredWindow = Titanium.UI.createWindow({
      id: 'starredWindow',
      title: 'Starred',
      backgroundColor: '#FFF',
      tabGroup: tabGroup
    });

    starredWindow.add(Titanium.UI.createLabel({
      text: 'Starred items go here',
      height: 50,
      width: 300,
      color: '#FFF',
      backgroundColor: '#000',
      top: 10,
      textAlign:' left',
      font: {fontSize: 18}
    }));

    return starredWindow;
  };

})();
