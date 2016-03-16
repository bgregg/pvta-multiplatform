angular.module('pvta.controllers').controller('GtfsController', function(){
  onLoad();
  function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
  }

  // Cordova is ready
  function onDeviceReady() {
    console.log('hello cordova');
    listDirectory();
  }

  function listDirectory() {
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
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