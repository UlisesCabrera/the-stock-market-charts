/* global angular randomColor*/

angular.module('QuandlModule')
    .controller('QuandlController',['$scope','quandlFactory','ioFactory', function($scope, quandlFactory, ioFactory){
        // function to add random colors to each item of the array.
        function addColor (array) {
            array.forEach(function(item){
                item.color = randomColor(); 
            });
        }
        
        // chart config object
        $scope.chartConfig = {
            options: {
                chart: {
                    zoomType: 'x',
                    shadow: true,
                    style: '{font-family: "Roboto"}'
                },
                rangeSelector: {
                    enabled: true
                },
                navigator: {
                    enabled: true
                }
            },
            series: [],
            title: {
                text: 'Stock Market'
            },
            useHighStocks: true,
            xAxis : {
                type: 'datetime'
            }
        };
        
        // gets all stocks from the database.
        quandlFactory.get()
            .$promise
                .then(
                    function(results){
                        
                        //adds random color to array
                        addColor(results.data);
                        
                        $scope.stocks = results.data;
                        
                        // inits the chart after it gets the results from the database.
                        $scope.stocks.forEach(function(stock, idx){
                            //formats date on data array
                            stock.data.forEach(function(data, idx){
                               data[0] = new Date(data[0]).getTime(); 
                            });
                         $scope.chartConfig.series.push({name: stock.dataset_code, data: stock.data, color: stock.color });
                        });
                    }, 
                    function(err){
                        console.log(err);
            });

        // binded to the form
        $scope.newStocks = {
            code: ''
        };
        
        $scope.hideMessage = function() {
            $scope.message = "";
        };
        
        // will hold stocks array of objects
        $scope.stocks = [];
        
        // listens for newStockAddedevent and push stock the the array.
        ioFactory.on('newStockAdded', function(message){
            $scope.$apply(function(){
                //adds random color to new stock
                message.data.color = randomColor();
                
                // adds the new stock to the stocks array
                
                $scope.stocks.push(message.data);
               
                //formats date on data array
                message.data.data.forEach(function(data, idx){
                   data[0] = new Date(data[0]).getTime(); 
                });
                
                // adds the new stock to the chart data array
                $scope.chartConfig.series.push({name: message.data.dataset_code, data: message.data.data, color: message.data.color });
                
            });
        });
        
        // listens for the stock deleted event and deletes the local copy 
        ioFactory.on('stockDeleted', function(message){
            console.log('deleted stock received');
            $scope.$apply(function(){
                $scope.stocks.forEach(function(stock, idx){
                    if (stock.id === message.data) {
                        $scope.stocks.splice(idx, 1);
                        
                        $scope.chartConfig.series.forEach(function(serie, idx){
                            if (serie.name === stock.dataset_code) {
                                 $scope.chartConfig.series.splice(idx, 1);
                            }
                        });                        
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
                        
                        //adds random color to new stock
                        message.data.color = randomColor();
                        
                        //updates stocks array
                        $scope.stocks.splice(idx, 1, message.data);
                        
                        //updates chart data
                        $scope.chartConfig.series.forEach(function(serie, idx){
                            if (serie.name === message.data.dataset_code) {
                                //formats date on data array
                                message.data.data.forEach(function(data, idx){
                                    data[0] = new Date(data[0]).getTime(); 
                                });
                                
                                // constructing new object to push to the chart.
                                var updatedObject = {name: message.data.dataset_code, data: message.data.data, color: message.data.color };
                                
                                // makes the update
                                $scope.chartConfig.series.splice(idx, 1, updatedObject);
                                
                            }
                        });
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
                    
                    $scope.chartConfig.series.forEach(function(serie, idx){
                        if (serie.name === stock.dataset_code) {
                             $scope.chartConfig.series.splice(idx, 1);
                        }
                    });                    
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