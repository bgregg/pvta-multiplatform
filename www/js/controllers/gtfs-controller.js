angular.module('pvta.controllers').controller('GtfsController', function($scope, $cordovaFile, Papa, $cordovaSQLite, $timeout){
  var database;
  
  $scope.chosenRoute = {LongName: ""};
  
  $scope.poop = function(){
    console.log(JSON.stringify($scope.chosenRoute));
  }
  
  function insertAll(){
    papaRoutes();
    papaStops();
    papaCalendarDates();
    $timeout(papaCalendar, 6000);
    $timeout(papaStopTimes, 12000);
    papaTrips();
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
       // console.log('inserting stop' + stop.stop_name);
        insertStop(stop);
      });
    }
    openGTFS('stops.txt', function(fileEntry){
      gotFile(fileEntry, papaComplete);
    });
  }
  
  function papaCalendarDates(){
    function papaComplete(results){
      var dates = results.data;
      _.each(dates, function(date){
        console.log('inserting calendardate for' + date.date);
        insertCalendarDate(date);
      });
    }
    openGTFS('calendar_dates.txt', function(fileEntry){
      gotFile(fileEntry, papaComplete);
    });
  }
  
  function papaCalendar(){
    function papaComplete(results){
      var calendars = results.data;
      _.each(calendars, function(calendar){
        console.log('inserting calendar');
        insertCalendar(calendar);
      });
    }
    openGTFS('calendar.txt', function(fileEntry){
      gotFile(fileEntry, papaComplete);
    });
  }
  
  function papaStopTimes(){
    function papaComplete(results){
      var stopTimes = results.data;
      _.each(stopTimes, function(time){
        console.log('inserting stop time');
      //  insertStopTime(time);
      });
    }
    openGTFS('stop_times.txt', function(fileEntry){
      gotFile(fileEntry, papaComplete);
    });
  }
  
  function papaTrips(){
    function papaComplete(results){
      var trips = results.data;
      _.each(trips, function(trip){
     //   console.log('inserting trip' + trip.trip_id);
        insertTrip(trip);
      });
    }
    openGTFS('trips.txt', function(fileEntry){
      gotFile(fileEntry, papaComplete);
    });
  }
  
  
  function openGTFS(filename, cb){
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/google_transit/"+ filename, cb, fail);
  }
  
  function gotFile(fileEntry, cb) {

    fileEntry.file(function(file) {
      var beg = 0;
      var mid = file.size / 2;
      var end = file.size-1;
      var firstHalf = file.slice(beg, mid);
      var secondHalf = file.slice(mid+1, end);
      var reader = new FileReader();
      var reader2 = new FileReader();
    //  reader.readAsText(firstHalf);
      reader2.readAsText(secondHalf);
      reader.onloadend = function(e) {
        Papa.parse(this.result, {
          header: true,
          complete: cb
        });
      }
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
  function insertCalendarDate(calendarDate){
    var query = "INSERT INTO calendar_dates (service_id, date, exception_type) VALUES (?,?,?)"
    $cordovaSQLite.execute(database, query, [calendarDate.service_id, calendarDate.date, calendarDate.exception_type]).then(function(res){
    },function(err){
      console.log(JSON.stringify(err));
    });
  }
  function insertCalendar(calendar){
    var query = "INSERT INTO calendar (service_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday, start_date, end_date) VALUES (?,?,?,?,?,?,?,?,?,?)";
    $cordovaSQLite.execute(database, query, [calendar.service_id, calendar.monday, calendar.tuesday, calendar.wednesday, calendar.thursday, calendar.friday, calendar.saturday, calendar.sunday, calendar.start_date, calendar.end_date]).then(function(res){
    },function(err){
      console.log(JSON.stringify(err));
    });
  }
  function insertStopTime(stopTime){
    var query = "INSERT INTO stop_times (trip_id, arrival_time, departure_time, stop_id, stop_sequence, pickup_type, drop_off_type) VALUES (?,?,?,?,?,?,?)";
    $cordovaSQLite.execute(database, query, [stopTime.trip_id, stopTime.arrival_time, stopTime.departure_time, stopTime.stop_id, stopTime.stop_sequence, stopTime.pickup_type, stopTime.drop_off_type]).then(function(res){
    },function(err){
      console.log(JSON.stringify(err));
    });
  }
  function insertTrip(trip){
    var query = "INSERT INTO trips (route_id, service_id, trip_id, trip_headsign, block_id, shape_id) VALUES (?,?,?,?,?,?)";
    $cordovaSQLite.execute(database, query, [trip.route_id, trip.service_id, trip.trip_id, trip.trip_headsign, trip.block_id, trip.shape_id]).then(function(res){
    },function(err){
      console.log(JSON.stringify(err));
    });
  }
  
});