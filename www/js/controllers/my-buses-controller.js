/*********My-Buses Controller.**************
 *  This controller is
 * the main page.
 * Handles retrieving favorite routes,
 * stops, and active alerts and
 * displays them to the user in its view
 * component.
********************************************/

angular.module('pvta.controllers').controller('MyBusesController', function($scope, Messages, FavoriteRoutes, FavoriteStops){
  // Every time my-buses is navigated to,
  // do something.
  $scope.$on('$ionicView.enter', function(e){
    reload();
  }) 
  
  // Retrieve the current lists of fave routes
  // and stops from localForage.
  var reload = function(){
    localforage.getItem('favoriteRoutes', function(err, value){
      $scope.routes = value;
    });
    localforage.getItem('favoriteStops', function(err, value){
      $scope.stops = value;
    });
  };
  $scope.stops = [];
  
  /*****************************
   * Called in view.  When user deletes
   * their entire list of routes,
   * delete them in localforage
   * AND empty the array for immediate
   * response to the user that we
   * have deleted their faves.
   ******************************/
  $scope.removeAll = function(){
    localforage.clear();
    $scope.routes = [];
  };
  
  // Similar to removeAll, but for a single route.
  $scope.removeRoute = function(route, currentIndex){
    FavoriteRoutes.remove(route);
    $scope.routes.splice(currentIndex, 1);
  };
  // removeAll, but for a single stop.
  $scope.removeStop = function(stop, currentIndex){
    FavoriteStops.remove(stop);
    $scope.stops.splice(currentIndex, 1);
  };
  
  $scope.messages = Messages.query();
  
})
