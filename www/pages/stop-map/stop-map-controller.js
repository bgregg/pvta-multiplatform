angular.module('pvta.controllers').controller('StopMapController', function ($scope, $ionicLoading, $stateParams, Stop, Map) {
  var bounds = new google.maps.LatLngBounds();
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();

  var mapOptions = {
    //sets the center to Haigis Mall
    //This may have to change if we end up deploying this to
    //the entire PVTA ridership
    center: new google.maps.LatLng(42.386270, -72.525844),
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true
  };

  function DirectionsControl(directionsDiv, map){
    var directionsUI = document.createElement('div');
    directionsUI.style.backgroundColor = '#387ef5';
    directionsUI.style.border = '2px solid blue';
    directionsUI.style.borderRadius = '3px';
    directionsUI.style.cursor = 'pointer';
    directionsUI.style.textAlign = 'center';
    directions.title = 'Click to get directions to this stop';
    directionsDiv.appendChild(directionsUI);

    var text = document.createElement('div');
    text.style.color = 'white';
    text.style.fontSize = '16px';
    text.innerHTML = 'Get Directions';
    directionsUI.appendChild(text);

    directionsUI.addEventListener('click', function(){
      $ionicLoading.show({});
      document.getElementById('stop-map').style.height = '50%';
      directionsDisplay.setPanel(document.getElementById('directions'));
      calculateDirections();
    });
  }

  $scope.map = new google.maps.Map(document.getElementById('stop-map'), mapOptions);
  Map.init($scope.map, bounds);

  function placeStop () {
    var loc = new google.maps.LatLng($scope.stop.Latitude, $scope.stop.Longitude);
    Map.addMapListener(Map.placeDesiredMarker(loc), 'Here is your stop!');
    return loc;
  }

  function calculateDirections () {
    var cb = function (position) {
      start = position;
      var end = placeStop();
      var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.WALKING
      };
      directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(result);
        }
        $ionicLoading.hide();
      });
    };
    Map.plotCurrentLocation(cb);
  }

  $scope.$on('$ionicView.enter', function () {
    $ionicLoading.show({});
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap($scope.map);
    var directionsControlDiv = document.createElement('div');
    var directionsControl = new DirectionsControl(directionsControlDiv, $scope.map);

    directionsControlDiv.index = 1;
    $scope.map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(directionsControlDiv);
    $ionicLoading.hide();
    $scope.stop = Stop.get({stopId: $stateParams.stopId}, function () {
      placeStop();
    });
  });

});
