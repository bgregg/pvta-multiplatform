angular.module('pvta.controllers').controller('VehicleMapController', function ($scope, $stateParams, Map, Vehicle) {
  ga('set', 'page', '/vehicle-map.html');
  ga('send', 'pageview');
  var vehicle;
  var mapOptions = {
    center: new google.maps.LatLng(42.386270, -72.525844),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  Map.init($scope.map);


  function placeVehicle (vehicle) {
    var loc = new google.maps.LatLng(vehicle.Latitude, vehicle.Longitude);
    //This content has been removed for the Beta 3 release. It will be finished for Beta 4

    var content = '<h4 style=\'color: #387ef5\'>Here is your bus!</h4>';

    //add a listener for that vehicle with that content as part of the infobubble
    Map.addMapListener(Map.placeDesiredMarker(loc, 'https://www.google.com/mapfiles/kml/paddle/go.png'), content);
  }

  $scope.$on('$ionicView.enter', function () {
    Map.plotCurrentLocation();
    vehicle = Vehicle.get({vehicleId: $stateParams.vehicleId}, function () {
      placeVehicle(vehicle);
      Map.addKML($stateParams.routeTraceFilename);
    });
  });

});
