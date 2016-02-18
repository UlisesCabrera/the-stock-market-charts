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
            console.log('deleted stock received');
            $scope.$apply(function(){
                $scope.stocks.forEach(function(stock, idx){
                    if (stock.id === message.data) {
                        $scope.stocks.splice(idx, 1);
                    }
                });                
            }); 
        });
        
        // listens for the stock updated event and updates the local copy 
        ioFactory.on('stockUpdated', function(message){
            console.log('updated stock received');
            $scope.$apply(function(){
                $scope.stocks.forEach(function(stock, idx){
                    if (stock.id === message.data._id) {
                        $scope.stocks.splice(idx, 1, message.data);
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
        
        $scope.updateStock = function(id, name) {
            quandlFactory.update({stockCode: id}, {
                stockName: name
            }).$promise
                .then(
                    function(results) { 
                        $scope.message = results.message; 
                    },
                    function(err){ 
                        console.error(err);
                });  
        };
}]);