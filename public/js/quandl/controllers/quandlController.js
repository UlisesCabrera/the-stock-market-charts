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
        
        // listens for the stock deleted event and deletes the local copy 
        ioFactory.on('stockDeleted', function(message){
            console.log('message received');
            $scope.$apply(function(){
                $scope.stocks.forEach(function(stock, idx){
                    if (stock.id === message.data) {
                        $scope.stocks.splice(idx, 1);
                    }
                });                
            }); 
        });
        
        $scope.getNewStock = function() {
            quandlFactory.get({stockCode: $scope.newStocks.code})
                .$promise
                    .then(
                        function(results){
                            // show message status of action on the view and clear form
                            $scope.message = results.message;
                            $scope.newStocks.code = '';
                        },
                        function(err) {
                            if(err) {
                                console.error(err);
                            }
                        }
                );
        };
        
        $scope.deleteStock = function(id) {
            // deletes local copy
            $scope.stocks.forEach(function(stock, idx){
                if (stock.id === id) {
                    $scope.stocks.splice(idx, 1);
                }
            });
            
            // deletes db copy
            quandlFactory.delete({stockCode: id})
                .$promise
                    .then(
                        function(results) {
                          $scope.message = results.message;  
                        }, 
                        function(err){
                            if(err) {
                                console.error(err);
                            }
                        }
                    );
        };
}]);