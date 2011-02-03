
(function() {

  DrupalCon.ui.createMoreWindow = function(tabGroup) {
    var moreWindow = Titanium.UI.createWindow({
      id: 'moreWindow',
      title: 'Maps',
      backgroundColor: '#FFF',
      tabGroup: tabGroup
    });

    moreWindow.add(Titanium.UI.createLabel({
      text: 'More stuff goes here',
      height: 50,
      width: 300,
      color: '#FFF',
      backgroundColor: '#000',
      top: 10,
      textAlign:' left',
      font: {fontSize: 18}
    }));

    return moreWindow;
  };

})();
