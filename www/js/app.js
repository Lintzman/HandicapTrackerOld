// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngDragDrop', 'handicaptracker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'MainController'
  })

 .state('app.golferlist', {
    url: "/golferlist",
    views: {
      'menuContent': {
        templateUrl: "templates/golferlist.html"
//        controller: 'MainController'
      }
    }
  })
  
    
  .state('app.golfer', {
    url: "/golfer",
    views: {
      'menuContent': {
        templateUrl: "templates/golfer.html",
        controller: 'GolferController'
      }
    }
  })


  .state('app.handicaphistory', {
    url: "/handicaphistory/:golferID",
    views: {
      'menuContent': {
        templateUrl: "templates/handicaphistory.html",
        controller: 'HandicapHistoryController'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/golferlist');
});
