/* global io angular*/

angular.module('QuandlModule').factory('ioFactory',['baseURL', 
    function(baseURL){
    
    return io.connect(baseURL);
    
}]);