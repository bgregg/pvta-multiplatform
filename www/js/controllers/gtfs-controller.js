angular.module('pvta.controllers').controller('GtfsController', function($scope, $cordovaFile, Papa, $cordovaSQLite){
  var database;
  
  $scope.chosenRoute = {LongName: ""};
  
  $scope.poop = function(){
    console.log(JSON.stringify($scope.chosenRoute));
  }
  
  function insertAll(){
    papaRoutes();
    papaStops();
  }
  
  function papaRoutes(){
    function papaComplete(results){
      var things = results.data;
      _.each(things, function(route){
        console.log('inserting route' + route.route_id);
        if(route.route_id !== "");
        insertRoute(route);
      });
    }
    openGTFS('routes.txt', function(fileEntry){
      gotFile(fileEntry, papaComplete);
    });
  }
  
  function papaStops(){
    function papaComplete(results){
      var stops = results.data;
      _.each(stops, function(stop){
        console.log('inserting stop' + stop.stop_name);
        insertStop(stop);
      });
    }
    openGTFS('stops.txt', function(fileEntry){
      gotFile(fileEntry, papaComplete);
    });
  }
  
  
  function openGTFS(filename, cb){
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/google_transit/"+ filename, cb, fail);
  }
  
  function gotFile(fileEntry, cb) {

    fileEntry.file(function(file) {
        var reader = new FileReader();

        reader.onloadend = function(e) {
          Papa.parse(this.result, {
            header: true,
            complete: cb
          });
        }

        reader.readAsText(file);
    });

}
  function fail(e) {
    console.log("FileSystem Error");
    console.dir(e);
}
  document.addEventListener('deviceready', function(){
    database = $cordovaSQLite.openDB({name: "pvta", location: 2});
    makeRoutesTable();
  });
  
  function makeRoutesTable(){
    var query = "CREATE TABLE IF NOT EXISTS routes (route_id text primary key, route_short_name text, route_long_name text, route_type integer)";
    $cordovaSQLite.execute(database, query).then(function(res){
      makeStopsTable();
    }, function(err){
      console.log(JSON.stringify(err));
    });
  }
  function makeStopsTable(){
    var query = "CREATE TABLE IF NOT EXISTS stops (stop_id integer primary key, stop_name text, stop_lon real, stop_lat real)"
    $cordovaSQLite.execute(database, query).then(function(res){
      makeCalendarDatesTable();
    }, function(err){
      console.log(JSON.stringify(err));
    });
  }
  
  function makeCalendarDatesTable(){
    var query = "CREATE TABLE IF NOT EXISTS calendar_dates (service_id text primary key, date text, exception_type integer)"
    $cordovaSQLite.execute(database, query).then(function(res){
      makeCalendarTable();
    }, function(err){
      console.log(JSON.stringify(err));
    });
  }
  
  function makeCalendarTable(){
    var query = "CREATE TABLE IF NOT EXISTS calendar (service_id text primary key, monday integer, tuesday integer, wednesday integer, thursday integer, friday integer, saturday integer, sunday integer, start_date text, end_date text)"
    $cordovaSQLite.execute(database, query).then(function(res){
      makeStopTimesTable();
    }, function(err){
      console.log(JSON.stringify(err));
    });
  }
  
  function makeStopTimesTable(){
    var query = "CREATE TABLE IF NOT EXISTS stop_times (trip_id text, arrival_time text, departure_time text, stop_id integer primary key, stop_sequence integer, pickup_type integer, drop_off_type integer)"
    $cordovaSQLite.execute(database, query).then(function(res){
      makeTripsTable();
    }, function(err){
      console.log(JSON.stringify(err));
    });
  }
  
  function makeTripsTable(){
    var query = "CREATE TABLE IF NOT EXISTS trips (route_id text, service_id text, trip_id text primary key, trip_headsign text,block_id text, shape_id text)"
    $cordovaSQLite.execute(database, query).then(function(res){
      insertAll();
    }, function(err){
      console.log(JSON.stringify(err));
    });
  }
  
  
  function insertRoute(route){
    var query = "INSERT INTO routes (route_id, route_short_name, route_long_name, route_type) VALUES (?,?,?,?)"
    console.log(JSON.stringify(route));
    $cordovaSQLite.execute(database, query, [route.route_id, route.route_short_name, route.route_long_name, route.route_type]).then(function(res){
    }, function(err){console.log(JSON.stringify(err))});
  }
  function insertStop(stop){
    var query = "INSERT INTO stops (stop_id, stop_name, stop_lon, stop_lat) VALUES (?,?,?,?)"
    $cordovaSQLite.execute(database, query, [stop.stop_id, stop.stop_name, stop.stop_lon, stop.stop_lat]).then(function(res){
    }, function(err){
      console.log(JSON.stringify(err));
    });
  }
  
  function getAStop(){
    var query = "SELECT stop_name FROM stops WHERE stop_id = 95";
    $cordovaSQLite.execute(database, query, []).then(function(res){
      if(res.rows.length > 0){
        console.log(JSON.stringify(res.rows.item(0)));
      }
    }, function(err){});
  }
  
});