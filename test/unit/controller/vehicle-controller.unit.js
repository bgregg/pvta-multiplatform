describe('VehicleController', function(){
  beforeEach(module('pvta'));
  
  var $controller;
  
  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));
  
  describe('$scope.firstTest', function(){
    var $scope, controller;
    beforeEach(function(){
      $scope = {};
      controller = $controller('VehicleController', {$scope: $scope});
    });
    it('sets $scope.vehicles to 1', function(){
      
      $scope.vehicles = 3;
      $scope.firstTest();
      expect($scope.vehicles).toEqual(1);
    });
  });
});