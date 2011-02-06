
(function() {

  DrupalCon.ui.createMoreWindow = function(tabGroup) {
    var moreWindow = Titanium.UI.createWindow({
      id: 'moreWindow',
      title: 'Presenters',
      backgroundColor: '#FFF',
      tabGroup: tabGroup
    });

    var conn = Drupal.db.getConnection('main');
    var rows = conn.query("SELECT uid, name, full_name FROM user");

    // As far as I can tell, objects aren't allowed to be sorted, so even though
    // I can write a sort on say a.lastName - it won't stay sorted (yes I tried)
    // so I have to build an array, sort it, then decompile it to use it.
    // Have I mentioned lately that javascript is not my favorite language right now?
    var nameList = [];
    if (rows) {
      while (rows.isValidRow()) {
        var full = rows.fieldByName('full_name');
        if (full) {
          var names = rows.fieldByName('full_name').split(' ');
          var lastName = names[names.length -1];
          var firstName = full.substr(0,full.length - (lastName.length + 1));
          nameList.push(lastName + ', ' + firstName + ':' + rows.fieldByName('uid'));
        }
        else {
          nameList.push(rows.fieldByName('name') + ':' + rows.fieldByName('uid'));
        }
        rows.next();
      }
    }

    // I want our list of names to have the usernames mixed in, and they usually
    // start with lowercase, so we need to create a custom sortorder that ignores case.
    function charOrdA(a, b) {
      a = a.toLowerCase(); b = b.toLowerCase();
      if (a > b) return 1;
      if (a < b) return -1;
      return 0;
    }
    var sortedNames = nameList.sort(charOrdA);

    // Now we can do something, like, oh I don't know, build the table :)
    var headerLetter = '';
    var index = [];
    var index2 = [];
    var presenterRow = [];
    var data = [];

    for (var i in sortedNames) {
      var user = sortedNames[i].split(':');
      var uid = user[1];
      var name = user[0];
      presenterRow = Ti.UI.createTableViewRow({
        title:name,
        hasChild: true,
        selectedColor: '#fff',
        backgroundColor: '#fff',
        color: '#000',
        uid:uid
      });

      // If there is a new last name first letter, insert a header in the table.
      // We also push a new index so we can create a right side index for iphone.
      if (headerLetter == '' || name.charAt(0).toUpperCase() != headerLetter) {
        headerLetter = name.charAt(0).toUpperCase();
        presenterRow.header = headerLetter;
        index.push({title:headerLetter,index:i});
        index2.push({title:headerLetter+headerLetter,index:i});
      }

      data.push(presenterRow);
    }
    

    // Create the table view
    var search = Titanium.UI.createSearchBar();
    var tableview = Titanium.UI.createTableView({
      backgroundColor: '#fff',
      data: data,
      search: search
    });
    tableview.index = index;

    // create table view event listener
    tableview.addEventListener('click', function(e) {
    	if (e.index == 0)
      tableview.index = index2;
      // event data
      var index = e.index;
      var currentTab = (Ti.Platform.name == 'android') ? currentTab = Titanium.UI.currentTab : moreWindow.tabGroup.activeTab;
      currentTab.open(DrupalCon.ui.createPresenterDetailWindow({
          title: e.rowData.name,
          uid: e.rowData.uid,
          name: e.rowData.name,
          tabGroup: Titanium.UI.currentTab
        }), {animated:true});
    });

    // add table view to the window
    moreWindow.add(tableview);

    return moreWindow;
  };

})();
