
(function() {

  DrupalCon.ui.createSessionDetailWindow = function(settings) {
    Drupal.setDefaults(settings, {
      title: 'title here',
      nid: '',
      tabGroup: undefined
    });

    var sessionDetailWindow = Titanium.UI.createWindow({
      id: 'sessionDetailWindow',
      title: settings.title,
      backgroundColor: '#FFF',
      tabGroup: settings.tabGroup
    });

    var itemWidth = (Ti.Platform.name == 'android') ? (Ti.UI.currentWindow.width - 40) : (sessionDetailWindow.width - 40);

    // Build session data
    var sessionData = Drupal.entity.db('main', 'node').load(settings.nid);

    // Get the presenter information.
    var presenterData = Drupal.entity.db('main', 'user').loadByField('name', sessionData.instructors);
    
    // Build the page:
    var tvData = [];
    var tv = Ti.UI.createTableView({
      minRowHeight: 50,
      textAlign: 'left',
      borderColor:"#fff"
    });
    var row = Ti.UI.createTableViewRow({height:'auto',className:"row",borderColor:"#fff", bottom: 10});

    var textView = Ti.UI.createView({
      height: 'auto',
      layout: 'vertical',
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      left: 10,
      top: 10,
      right: 10,
      bottom: 10
    });

    var titleLabel = Ti.UI.createLabel({
      text: cleanSpecialChars(sessionData.title),
      font: {fontSize: 24, fontWeight: 'bold'},
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      height: 'auto',
      width: itemWidth
    });
    textView.add(titleLabel);

    for (var i = 0, numPresenters = presenterData.length; i < numPresenters; i++) {
      var presenterName = Ti.UI.createLabel({
        text: presenterData[i].full_name,
        backgroundColor: '#fff',
        font: {fontSize: 14, fontWeight: 'normal'},
        textAlign: 'left',
        color: '#000',
        height: 'auto',
        top: 10,
        width: itemWidth
      });
      textView.add(presenterName);
    }

    var room = Ti.UI.createLabel({
      text: sessionData.room.map(cleanSpecialChars).join(', '),
      backgroundColor: '#fff',
      font: {fontSize: 13, fontWeight: 'bold'},
      textAlign: 'left',
      color: '#000',
      top: 12,
      width: itemWidth,
      height: 'auto',
    });
    textView.add(room);

    var startDate = parseISO8601(sessionData.start_date + ':00');
    var datetime = Ti.UI.createLabel({
      text: cleanDate(startDate) + ', ' + cleanTime(sessionData.start_date),
      backgroundColor: '#fff',
      font: {fontSize: 14, fontWeight: 'normal'},
      textAlign: 'left',
      color: '#000',
      top: 0,
      bottom: 10,
      width: itemWidth,
      height: 'auto'
    });
    textView.add(datetime);

    var body = Ti.UI.createLabel({
      text: sessionData.body.replace('\n','\n\n'),
      backgroundColor: '#fff',
      textAlign: 'left',
      font: {fontSize: 14, fontWeight: 'normal'},
      color: '#000',
      top: 20,
      bottom: 10,
      width: itemWidth,
      height: 'auto'
    });
    textView.add(body);

    row.add(textView);
    tvData.push(row);

    
    var row3 = Ti.UI.createTableViewRow({height: 'auto',className: 'row',borderColor: '#fff'});

    var textViewBottom = Ti.UI.createView({
      height: 'auto',
      layout: 'vertical',
      backgroundColor: '#fff',
      textAlign: 'left',
      color: '#000',
      left: 10,
      right: 10
    });

    var audienceTitle = Ti.UI.createLabel({
      text:"Intended Audience",
      backgroundColor:'#fff',
      textAlign:'left',
      font:{fontSize:18, fontWeight:'bold'},
      color:'#000',
      top:20,
      width:itemWidth,
      height:'auto'
    });
    textViewBottom.add(audienceTitle);

    var audience = Ti.UI.createLabel({
      text:sessionData.audience.replace('\n','\n\n'),
      backgroundColor:'#fff',
      textAlign:'left',
      color:'#000',
      top:10,
      width:itemWidth,
      height:'auto',
      bottom: 20
    });
    textViewBottom.add(audience);
    row3.add(textViewBottom);
    tvData.push(row3);

    var presentersTitle = Ti.UI.createLabel({
      text:"Presenter(s)",
      backgroundColor:'#fff',
      textAlign:'left',
      font:{fontSize:18, fontWeight:'bold'},
      color:'#000',
      top:20,
      width:itemWidth,
      height:'auto'
    });
    var presentersTitleRow = Ti.UI.createTableViewRow({height: 'auto',className: 'row',borderColor: '#fff'});
    presentersTitleRow.add(presentersTitle);
    tvData.push(presentersTitleRow);

    for (var j in presenterData) {
      tvData.push(renderPresenter(presenterData[j]));
    }

    tv.addEventListener('click', function(e) {
      if (e.source.presenter != undefined){
        if (e.source.presenter.full_name == undefined) {
          var fullName = '';
        }
        else {
          var fullName = e.source.presenter.full_name;
        }

        var currentTab = (Ti.Platform.name == 'android') ? Titanium.UI.currentTab : sessionDetailWindow.tabGroup.activeTab;
        currentTab.open(DrupalCon.ui.createPresenterDetailWindow({
          title: fullName,
          uid: e.source.presenter.uid,
          tabGroup: Titanium.UI.currentTab
        }), {animated:true});
      }
    });

    
    tv.setData(tvData);
    sessionDetailWindow.add(tv);

    return sessionDetailWindow;
  };

  function renderPresenter(presenter) {
    var presRow = Ti.UI.createTableViewRow({
      presenter: presenter,
      height: 80,
      className: "row",
      borderColor: '#fff',
      hasChild: true,
      leftImage: 'images/userpict-medium.png',
      layout:'vertical'
    });
    var presenterFullName2 = Ti.UI.createLabel({
      presenter: presenter,
      text: presenter.full_name,
      font: {fontSize:18, fontWeight:'bold'},
      left: 85,
      top: 10,
      height: 'auto'
    });
    var presenterName2 = Ti.UI.createLabel({
      presenter: presenter,
      text: presenter.name,
      font:{fontSize:14, fontWeight:'normal'},
      left: 85,
      top: 5,
      height: 'auto',
      color: "#666"
    });

    presRow.add(presenterFullName2);
    presRow.add(presenterName2);

    return presRow;
  }

})();

