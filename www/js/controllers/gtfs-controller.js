angular.module('pvta.controllers').controller('GtfsController', function($scope, $cordovaFile, Papa, $cordovaSQLite){
  onLoad();
  var routesFromGTFS = [];
  
  $scope.chosenRoute = {LongName: ""};
  
  $scope.poop = function(){
    console.log('booty');
    console.log(JSON.stringify($scope.chosenRoute));
  }
  
  function onLoad() {
    document.addEventListener("deviceready", function(){
      openGTFS('routes.txt');
     // openGTFS('stops.txt');
    }, false);
  }
  
  function openGTFS(filename){
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/google_transit/"+ filename, gotFile, fail);
  }
  
  function gotFile(fileEntry) {

    fileEntry.file(function(file) {
        var reader = new FileReader();

        reader.onloadend = function(e) {
          Papa.parse(this.result, {
            header: true,
            complete: papaComplete
          });
            //console.log("Text is: "+this.result);
         //   document.querySelector("#textArea").innerHTML = this.result;
        }

        reader.readAsText(file);
    });

}
  function fail(e) {
    console.log("FileSystem Error");
    console.dir(e);
}
  
  function papaComplete(results){
    $scope.routes = results.data;
    _.each($scope.routes, function(route){
     routesFromGTFS.push(route);
    });
    
  }

  // Cordova is ready
  function onDeviceReady() {
    console.log('hello cordova');
    listDirectory();
  }

  function listDirectory() {
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory+"www/google_transit", function (dirEntry) {
      var directoryReader = dirEntry.createReader();
      directoryReader.readEntries(dirSuccess,dirFail);
    });	
  }

  function dirSuccess(entries) {
    console.log("INFO: Listing entries");
    var i;
    for (i=0; i<entries.length; i++) {
      console.log(entries[i].name);
    }
  }

  function dirFail(error) {
    console.log("Failed to list directory contents: " + error.code);
  }
  
  document.addEventListener('deviceready', function(){
    var db = $cordovaSQLite.openDB({name: "pvta", location: 2});
    makeRoutesTable(db);
  });
  
  function makeRoutesTable(db){
    var query = "CREATE TABLE IF NOT EXISTS routes (route_id integer primary key, route_short_name text, route_long_name text, route_type integer)";
    $cordovaSQLite.execute(db, query).then(function(res){
     // console.log(JSON.stringify(res));
      insertRoutes(db);
      makeStopsTable(db);
    }, function(err){
      console.log(JSON.stringify(err));
    });
  }
  function makeStopsTable(db){
    var query = "CREATE TABLE IF NOT EXISTS stops (stop_id integer primary key, stop_name text, stop_lon real, stop_lat real)"
    $cordovaSQLite.execute(db, query).then(function(res){
      //console.log(JSON.stringify(res));
      printAll(db);
    }, function(err){
      console.log(JSON.stringify(err));
    });
  }
  function printAll(db){
    $cordovaSQLite.execute(db, "SELECT * FROM routes", []).then(function(res){
      console.log(JSON.stringify(res.rows.item.length));
      if(res.rows.item.length > 0) {
        console.log(JSON.stringify(res.rows.item[0]));
        _.each(res.rows.item, function(route){
          console.log(JSON.stringify(route));
        })
      }
    }, function(err){
      console.log(JSON.stringify(err));
    });
    $cordovaSQLite.execute(db, "SELECT * FROM stops", []).then(function(res){
      console.log(JSON.stringify(res));
    }, function(err){
      console.log(JSON.stringify(err));
    });
  }
  
  function insertRoutes(db){
    var query = "INSERT INTO routes (route_id, route_short_name, route_long_name, route_type) VALUES (?,?,?,?)"
    if(routesFromGTFS.length > 0){
     // console.log('insert routes here, list exsits yay');
      _.each(routesFromGTFS, function(route){
       // console.log(route.route_id);
        $cordovaSQLite.execute(db, query, [route.route_id, route.route_short_name, route.route_long_name, route.route_type]).then(function(res){
         // console.log(JSON.stringify(res));
        });
      })
    }
  }
  
});