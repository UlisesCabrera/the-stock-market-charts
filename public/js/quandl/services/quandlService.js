angular.module('QuandlModule').factory('quandlFactory',['$resource','baseURL', 
    function($resource, baseURL){
    
    return $resource(baseURL+'quandl/:stockCode', null, {
                'update': {
                    method: 'PUT'
                }
           });  
}]);