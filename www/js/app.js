// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module("starter", ["ionic", "firebase"])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('login', {
    url: '/',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'LoginCtrl'
  })
  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'LoginCtrl'
  });

  $urlRouterProvider.otherwise("/");

}).controller('LoginCtrl', function($scope, $state, $firebaseAuth) {
  $scope.data = {
    username: '',
    email: '',
    password: ''
   };
  $scope.signupEmail = function(){
    $scope.message = null;
    $scope.error = null;

    console.log('In signup email with username ' +  $scope.data.username + ' email ' + $scope.data.email + ' and password ' + $scope.data.password);
    var chatRef = new Firebase('https://chat-test-ionic.firebaseio.com');
    var auth = $firebaseAuth(chatRef);
    auth.$createUser({
      email: $scope.data.email,
      password: $scope.data.password
    }).then(function(userData) {
        console.log("User created with uid: " + userData.uid);
        $scope.message = "User created with uid: " + userData.uid;
      }).catch(function(error) {
        console.log("Error: " + error);
        $scope.error = error;
      });

  };


    $scope.loginEmail = function() {
      $scope.authData = null;
      $scope.error = null;

      auth.$authAnonymously().then(function(authData) {
        $scope.authData = authData;
      }).catch(function(error) {
        $scope.error = error;
      });
    };

});
