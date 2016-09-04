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
  }).state('chat', {
  url: '/chat',
  templateUrl: 'templates/chat.html',
  controller: 'ChatCtrl'
  }).state('room', {
    url: '/room',
    templateUrl: 'templates/room.html',
    controller: 'RoomCtrl'
}).state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'LoginCtrl'
  });

  $urlRouterProvider.otherwise("/");

}).factory('Messages', function($firebaseArray) {
  var ref = firebase.database().ref();
  return $firebaseArray(ref);
}).factory('Users', function ($firebaseArray) {
    // Might use a resource here that returns a JSON array
    var ref = firebase.database().ref();
    //var users = $firebaseArray(ref.child('users')).$asArray();
    var users = firebase.database().list('/items');
    return {
        all: function () {
            return users;
        },
        get: function (userId) {
            // Simple index lookup
            return users.$getRecord(userId);
        },
        create: function () {
          return $firebaseArray(ref);
        }
    }
}).controller('ChatCtrl', function($scope, $state, $ionicPopup, Messages,  $firebaseAuth) {
  $scope.messages = Messages;
  $scope.addMessage = function() {
   $ionicPopup.prompt({
     title: 'Need to get something off your chest?',
     template: 'Let everybody know!'
   }).then(function(res) {
      $scope.messages.$add({
        "messages": res
      });
   });
  };
  $scope.logout = function() {
    var ref = $firebaseAuth();
    ref.$signOut();
    $state.go('login');
  };
}).controller('LoginCtrl', function($scope, $state, $firebaseAuth, Users) {
  $scope.data = {
    username: '',
    email: '',
    password: ''
   };
  $scope.signupEmail = function(){
    $scope.message = null;
    $scope.error = null;
    var auth = $firebaseAuth();
    auth.$createUserWithEmailAndPassword($scope.data.email, $scope.data.password)
    .then(function(firebaseUser) {
      console.log("User " + firebaseUser.uid + " created successfully!");
      $scope.users = Users;
      $scope.users.create().$add({
        "users": {id: firebaseUser.uid, email: firebaseUser.email }
      });
    }).catch(function(error) {
      console.error("Error: ", error);
    });

  };
    $scope.loginEmail = function() {
      var auth = $firebaseAuth();

    //  auth.$signInWithEmailAndPassword($scope.data.email, $scope.data.password).then(function(firebaseUser) {
    auth.$signInWithEmailAndPassword('patito@gmail.com', 'patito').then(function(firebaseUser) {
       $state.go('room');
      }).catch(function(error) {
       console.error("Authentication failed:", error);
      });
    };
}).controller('RoomCtrl', function ($scope, Users, $state) {
    //console.log("Rooms Controller initialized");
    $scope.rooms = Users.all();
    $scope.openChatRoom = function (userId) {
        $state.go('chat', {
            userId: userId
        });
    }
});
