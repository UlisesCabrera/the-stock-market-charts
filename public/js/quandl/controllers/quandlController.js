angular.module('QuandlModule')
    .controller('QuandlController',['$scope','quandlFactory','ioFactory', function($scope, quandlFactory, ioFactory){
        
        $scope.hello = 'Hello from controller';
        
        ioFactory.on('hello', function(data){
            $scope.$apply(function(){
               $scope.message = data.message; 
            });
        });
        
        $scope.sendMessage = function() {
          ioFactory.emit('my other event', { my: 'hello from service' });  
        };
    
}]);