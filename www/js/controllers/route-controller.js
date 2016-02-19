angular.module('pvta.controllers').controller('RouteController', function($scope, $stateParams, Route, RouteVehicles, FavoriteRoutes, Messages){
  var size = 0;
  
  //Retieve the route from Avail.
  // $stateparams includes the routeId that was passed to this controller
  // via dynamic routing (see app.js)
  var route = Route.get({routeId: $stateParams.routeId}, function() {
    route.$save();
    getHeart();
    $scope.stops = route.Stops;
    $scope.vehicles = route.Vehicles

    // Need route to be defined before we can filter messages,
    // hence it is inside this callback.
    var messages = Messages.query(function(){
      var filteredMessages = [];
      for(var message of messages){
        // If the message doesn't apply to this route, continue to the next message.
        if(message.Routes.indexOf($scope.route.RouteId) === -1) { continue; }
        // Else, it DOES apply. Add it to our messages array.
        filteredMessages.push(message);
      }
      $scope.messages = filteredMessages;
    });
  });
  $scope.route = route;


  $scope.stops = [];
  var j = $scope.size;
  
  /*****************************
   * Used for expanding the accordion
   * list of stops.
   * Input: the list of stops
   * Output: nothing (just changes vars in-place)
   ****************************/
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  
  // Used for checking whether to show an
  // option to expand the stoplist or to
  // collapse it
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
  
  /***********************************
   * Saves whether the 'favorites'
   * heart on the page is solid (favorited)
   * or an outline (not favorited).
   *
   * Input: boolean
   * Output: nothing
  ***********************************/
  $scope.toggleHeart = function(liked){
    // localForage uses (key, value) pairs:
    var name = 'Route ' + route.ShortName + ' favorite';
      // Save the key value pair (name, liked) to localForage
      localforage.setItem(name, liked, function(err, value){
        /* LocalForage returns the value we gave it on success.
         * Since we don't know whether we were passed true or false,
         * we check now and use our Factory to add/remove the
         * route in question from the master list. */
        if(value) {
          FavoriteRoutes.push(route);
        }
        else {
          FavoriteRoutes.remove(route);
        }
    });
  };
  
  /****************************************
   * Checks whether the route has been favorited.
   * Queries localForage using the known key
   * method (which is used in toggleHeart when saving).
  ****************************************/
  var getHeart = function(){
    var name = 'Route ' + route.ShortName + " favorite";
    localforage.getItem(name, function(err, value){
      // Set $scope.liked to be the boolean value returned
      // by localForage. Heart color will be set accordingly
      // using this value.
      $scope.liked = value;
    });
  };
});
