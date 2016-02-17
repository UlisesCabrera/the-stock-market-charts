angular.module('QuandlModule')
    .controller('QuandlController',['$scope','quandlFactory','ioFactory', function($scope, quandlFactory, ioFactory){
        // binded to the form
        $scope.newStocks = {
            code: ''
        };
        
        // will hold stocks array of objects
        $scope.stocks = [];
        
        // listens for initialStocks event and add all stocks on db to the array.
        ioFactory.on('initialStocks', function(message){
            $scope.$apply(function(){
               $scope.stocks = message.data;
               console.log($scope.stocks);
            });
        });
        
        // listens for newStockAddedevent and push stock the the array.
        ioFactory.on('newStockAdded', function(message){
            $scope.$apply(function(){
               $scope.stocks.push(message.data);
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