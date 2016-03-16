angular.module('pvta.controllers').controller('GtfsController', function($scope, $cordovaFile, Papa){
  onLoad();
  function onLoad() {
    document.addEventListener("deviceready", openFile, false);
  }
  
  function openFile(){
    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/google_transit/routes.txt", gotFile, fail);
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
      console.log(JSON.stringify(route));
    })
    
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
});