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
    
    // Build the page:
    var tvData = [];
    var blueBg = '#FFF';

    // Structure
    var tv = Ti.UI.createTableView({
      textAlign: 'left',
      layout:'vertical'
    });
    var headerRow = Ti.UI.createTableViewRow({
      height: 'auto',
      backgroundColor: blueBg,
      left: 0,
      top: -5,
      bottom: 10,
      layout: 'vertical',
      className: 'headerRow'
    });

    var bodyRow = Ti.UI.createTableViewRow({
      hasChild: false,
      height: 'auto',
      backgroundColor: blueBg,
      left: 0,
      top: -5,
      bottom: 10,
      layout: 'vertical',
      className: 'bodyRow'
    });

    if (sessionData.title) {
      var titleLabel = Ti.UI.createLabel({
        text: cleanSpecialChars(sessionData.title),
        font: {fontSize: 24, fontWeight: 'bold'},
        textAlign: 'left',
        color: '#000',
        left: 10,
        top: 'auto',
        bottom: 10,
        right: 10,
        height: 'auto'
      });
      headerRow.add(titleLabel);
    }
    // Some sessions have multiple presenters
    if (sessionData.instructors) {
      var presenterName = Ti.UI.createLabel({
        text: sessionData.instructors.map(DrupalCon.util.getPresenterName).join(', '),
        font: {fontSize:12, fontWeight:'normal'},
        color: '#000',
        left: 10,
        top: 'auto',
        bottom: 5,
        right: 10,
        height: 'auto'
      });
      headerRow.add(presenterName);
    }

    if (sessionData.room) {
      var room = Ti.UI.createLabel({
        text: sessionData.room.map(cleanSpecialChars).join(', '),
        font: {fontSize: 13, fontWeight: 'bold'},
        textAlign: 'left',
        color: '#000',
        left: 10,
        top: 'auto',
        bottom: 10,
        right: 10,
        height: 'auto'
      });
      headerRow.add(room);
    }

    if (sessionData.start_date) {
      var startDate = parseISO8601(sessionData.start_date + ':00');
      var datetime = Ti.UI.createLabel({
        text: cleanDate(startDate) + ', ' + cleanTime(sessionData.start_date),
        font: {fontSize: 14, fontWeight: 'normal'},
        textAlign: 'left',
        color: '#000',
        left: 10,
        top: 'auto',
        bottom: 10,
        right: 10,
        height: 'auto'
      });
      headerRow.add(datetime);
    }

    if (sessionData.body) {
      var body = Ti.UI.createLabel({
        text: cleanSpecialChars(sessionData.body.replace('\n','\n\n')),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        left: 10,
        top: 10,
        bottom: 10,
        right: 10,
        height: 'auto'
      });
      bodyRow.add(body);
    }

    if (sessionData.core_problem) {
      var problemTitle = Ti.UI.createLabel({
        text:"Problem:",
        backgroundColor:'#fff',
        textAlign:'left',
        font:{fontSize:18, fontWeight:'bold'},
        color:'#000',
        left: 10,
        top: 10,
        bottom: 'auto',
        right: 10,
        height: 'auto'
      });
      bodyRow.add(problemTitle);

      var coreProblem = Ti.UI.createLabel({
        text: cleanSpecialChars(sessionData.core_problem.replace('\n','\n\n')),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        left: 10,
        top: 5,
        bottom: 10,
        right: 10,
        height: 'auto'
      });
      bodyRow.add(coreProblem);
    }

    if (sessionData.core_solution) {
      var solutionTitle = Ti.UI.createLabel({
        text:"Solution:",
        backgroundColor:'#fff',
        textAlign:'left',
        font:{fontSize:18, fontWeight:'bold'},
        color:'#000',
        left: 10,
        top: 10,
        bottom: 'auto',
        right: 10,
        height: 'auto'
      });
      bodyRow.add(solutionTitle);

      var coreSolution = Ti.UI.createLabel({
        text: cleanSpecialChars(sessionData.core_solution.replace('\n','\n\n')),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        left: 10,
        top: 5,
        bottom: 10,
        right: 10,
        height: 'auto'
      });
      bodyRow.add(coreSolution);
    }

    tvData.push(headerRow);

    if (sessionData.type === 'session') {
      var feedbackTitle = Ti.UI.createLabel({
        text:"Provide Feedback",
        backgroundColor:'#fff',
        textAlign:'left',
        font:{fontSize:18, fontWeight:'bold'},
        color:'#000',
        left: 10,
        top: 10,
        bottom: 10,
        right: 10,
        height: 'auto'
      });

      var feedbackRow = Ti.UI.createTableViewRow({
        hasChild: true,
        layout:'vertical',
        className: 'feedbackRow'
      });
      feedbackRow.add(feedbackTitle);

      feedbackRow.addEventListener('click', function(e) {
        var currentTab = (Ti.Platform.name == 'android') ? currentTab = Titanium.UI.currentTab : sessionDetailWindow.tabGroup.activeTab;
        currentTab.open(DrupalCon.ui.createFeedbackWindow({
          title: settings.title,
          address: 'http://chicago2011.drupal.org/node/add/eval/' + settings.nid,
          //address: 'http://google.com',
          tabGroup: currentTab
        }), {animated:true});
      });

      tvData.push(feedbackRow);
    }

    tvData.push(bodyRow);

    if (sessionData.audience) {
      var audienceRow = Ti.UI.createTableViewRow({height: 'auto', className: 'audienceRow', borderColor: '#fff'});

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
        left: 0,
        top: 20,
        bottom: 10,
        right: 10,
        height: 'auto'
      });
      textViewBottom.add(audienceTitle);

      var audience = Ti.UI.createLabel({
        text:sessionData.audience.replace('\n','\n\n'),
        backgroundColor:'#fff',
        textAlign:'left',
        color:'#000',
        height:'auto',
        width:'auto',
        left:0,
        right:0,
        top:10,
        bottom:10
      });

      textViewBottom.add(audience);
      audienceRow.add(textViewBottom);
      tvData.push(audienceRow);
    }


    if (sessionData.instructors && sessionData.instructors.length) {
      // Get the presenter information.
      var presenterData = Drupal.entity.db('main', 'user').loadByField('name', sessionData.instructors);

      for (var j in presenterData) {
        tvData.push(renderPresenter(presenterData[j]));
      }
    }

    tv.addEventListener('click', function(e) {
      if (e.source.presenter != undefined){
        var fullName = e.source.presenter.full_name || '';
        var currentTab = (Ti.Platform.name == 'android') ? Titanium.UI.currentTab : sessionDetailWindow.tabGroup.activeTab;
        currentTab.open(DrupalCon.ui.createPresenterDetailWindow({
          title: fullName,
          uid: e.source.presenter.uid,
          tabGroup: currentTab
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
      className: 'presenterRow',
      borderColor: '#fff',
      hasChild: true,
      leftImage: 'images/userpict-medium.png',
      layout:'vertical'
    });
    var presenterFullName2 = Ti.UI.createLabel({
      presenter: presenter,
      text: cleanSpecialChars(presenter.full_name),
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

