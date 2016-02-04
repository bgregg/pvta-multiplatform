describe('SearchController', function(){
  var controller,
      vehiclesMock,
      routeListMock,
      stopListMock,
      stopsMock,
      deferredVehicles,
      deferredRouteList,
      deferredStopList,
      deferredStops,
      stateMock,
      scopeMock,
      ionicFilterBarMock,
      resourceMock;
  
  //TODO: Load app module
  beforeEach(module('pvta'));
  
  //TODO: Instantiate Controller and/or Mocks
  beforeEach(inject(function($controller, $q){
    deferredVehicles = $q.defer();
    
    //mock Vehicle service
    vehiclesMock = {
      jasmine.createSpy('vehicles spy').and.returnValue(deferredVehicles.promise)
    };
    
    //mock RouteList service
    routeListMock = {
      jasmine.createSpy('routelist spy').and.returnValue(deferredRouteList.promise)
    };
    
    //mock StopList service
    stopListMock = {
      jasmine.createSpy('stoplist spy').and.returnValue(deferredStopList.promise)
    };
    
    
    //mock Stops service
    stopsMock = {
      jasmine.createSpy('stops spy').and.returnValue(deferredStops.promise)
    };
    
    
    //mock $state
    stateMock = jasmine.createSpyObj('$state spy');
    
    //mock $scope
    scopeMock = jasmine.createSpyObj('$scope spy');
    
    //mock $ionicFilterBar
    ionicFilterBarMock = jasmine.createSpyObj('$ionicFilterBar spy', ['show']);
    
    //mock $resource
    resourceMock = jasmine.createSpyObj('$resource spy', ['get', 'query']);
    
    controller = $controller('SearchController', {
      
    })

  }));
  
  describe('#getItems', function(){
    //TODO: Call getItems on the Controller
    
    it('should call the Vehicles factory', function(){
      expect(Vehicles).toHaveBeenCalled();
    });
    
  });
});