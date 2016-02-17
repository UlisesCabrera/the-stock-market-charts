angular.module('QuandlModule')
    .controller('QuandlController',['$scope','quandlFactory','ioFactory', function($scope, quandlFactory, ioFactory){
        // binded to the form
        $scope.newStocks = {
            code: ''
        };
        
        // will hold stocks array of objects
        $scope.stocks = [];
        
        // listens for updates on the stocks collection. 
        ioFactory.on('stocksUpdated', function(message){
            $scope.$apply(function(){
               $scope.stocks = message.data;
               console.log($scope.stocks);
            });
        });
        
        $scope.getNewStock = function() {
            quandlFactory.get({stockCode: $scope.newStocks.code})
                .$promise
                    .then(
                        function(results){
                            // show message status of action on the view and clear form
                            $scope.message = results.status;
                            $scope.newStocks.code = '';
                        },
                        function(err) {
                            if(err) {
                                console.error(err);
                            }
                        }
                );
        };
}]);