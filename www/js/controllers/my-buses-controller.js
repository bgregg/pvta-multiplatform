angular.module('pvta.controllers').controller('MyBusesController', function ($scope, Messages, FavoriteRoutes, FavoriteStops, $cordovaSQLite, $location) {
  $scope.$on('$ionicView.enter', function (e) {
    reload();
    $location.path('/app/gtfs');
  });
  var reload = function () {
    localforage.getItem('favoriteRoutes', function (err, value) {
      $scope.routes = value;
    });
    localforage.getItem('favoriteStops', function (err, value) {
      $scope.stops = value;
    });
  };

  $scope.stops = [];
  $scope.removeAll = function () {
    localforage.clear();
    $scope.routes = [];
  };

  $scope.messages = Messages.query();

  $scope.removeRoute = function (route, currentIndex) {
    FavoriteRoutes.remove(route);
    $scope.routes.splice(currentIndex, 1);
  };

  $scope.removeStop = function (stop, currentIndex) {
    FavoriteStops.remove(stop);
    $scope.stops.splice(currentIndex, 1);
  };
  
  document.addEventListener('deviceready', function(){
    $cordovaSQLite.deleteDB({name: "pvta", location: 2});
   
    //var db = $cordovaSQLite.openDB({name: "pvta", location: 2});
    
   // var query1 = "CREATE TABLE IF NOT EXISTS routes (id integer primary key, routeid integer, shortname text)";
   // $cordovaSQLite.execute(db, query1).then(function(res){
   //   console.log(JSON.stringify(res));
   //   q2(db);
  //  }, function(err){
  //    console.log(JSON.stringify(err));
  //  });  
  });
  
  
  /*
  function q2(db){
    var query2 = "INSERT INTO routes (routeid, shortname) VALUES (?,?)";
    $cordovaSQLite.execute(db, query2, [20031, "31"]).then(function(res){
      console.log(JSON.stringify(res));
      rows(db);
    }, function(err){
      console.log(JSON.stringify(err));
    });  
  }
  
  function rows(db){
    var query3 = "SELECT routeid, shortname FROM routes";
    $cordovaSQLite.execute(db, query3, []).then(function(res){
      if(res.rows.length > 0) {
        console.log(JSON.stringify(res.rows.item(2)));
        console.log("SELECTED -> " + res.rows.item(0).routeid + " " + res.rows.item(0).shortname);
      }
      else {
        console.log("No results found");
      }
    }, function(err){
      console.error(err);
    });
  }
  */
});
