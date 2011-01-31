/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var menu = {

  isAndroid: Ti.Platform.name == 'android',
  data: [],
  tiVersion: 1.5,

  init: function (params) {
    if (!menu.isAndroid) {
      //create iphone menu.
      var index = 0;
      var win = params.win     
      var flexSpace = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE
      });
      menu.data[index++] = flexSpace;
      for (var k = 0; k < params.buttons.length; k++) {
        menu.data[index] = Ti.UI.createButton({
          title: params.buttons[k].title,
          style: Ti.UI.iPhone.SystemButtonStyle.BORDERED
        });
        menu.data[index].addEventListener("click", params.buttons[k].clickevent);
        index++;
        menu.data[index++] = flexSpace;
      }
      var button = Ti.UI.createButton({
        systemButton: Ti.UI.iPhone.SystemButton.INFO_DARK
      });
      win.rightNavButton = button;
      button.addEventListener('click', function(e) {
        if (win.toolbar) {
          win.setToolbar(null);
        }
        else {
          win.setToolbar(menu.data);
        }

      });
      
    }
    else {
      //create android menu.
      if (menu.tiVersion >= 1.5) {
        var activity = Ti.Android.currentActivity;
        activity.onCreateOptionsMenu = function (e) {
          var optionsmenu = e.menu;
          for (var k = 0; k < params.buttons.length; k++) {
            menu.data[k] = optionsmenu.add({
              title: params.buttons[k].title
            })
            menu.data[k].addEventListener("click", params.buttons[k].clickevent);
          }
        }
      }
      else {
        //pre-ti 1.5 way to create menu.
        var optionsmenu = Ti.UI.Android.OptionMenu.createMenu();
        for (var k = 0; k < params.buttons.length; k++) {
          menu.data[k] = Ti.UI.Android.OptionMenu.createMenuItem({
            title: params.buttons[k].title
          })
          menu.data[k].addEventListener("click", params.buttons[k].clickevent);
          optionsmenu.add(menu.data[k]);
        }
        Ti.UI.Android.OptionMenu.setMenu(optionsmenu);
      }
    }
  },

  setTiVersion: function (value) {
    //only need to set this if using android and an older version of ti than 1.5.
    menu.tiVersion = value;
  }

};