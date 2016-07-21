angular.module('iGrow',[
	'iGrow.services',
	'iGrow.auth'
])

//routing 

.config(function ($routeProvider, $httpProvider) {
  $routeProvider

 .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
 .when('/signup', {
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthController'
    })
 .when('/', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
 .when('/browse-all', {
 	templateUrl: 'app/browse-all.html',
 	controller: 'BrowsController'
 })
 .when('/mygarden', {
 	templateUrl: 'app/mygarden.html',
 	controller: 'GardenController'

 })

 $httpProvider.interceptors.push('AttachTokens')
})

 .factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.iGrow');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) {
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/signin')
    }
  })
});