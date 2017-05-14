angular.module('myapp')
    .factory('loaderInerceptor', ['$q', function(AuthToken, $q){
        var loaderInerceptor = {};
        var $el = document.getElementsByClassName('loader');
        loaderInerceptor.request = function(config){
            angular.element($el).removeClass('hide');
            return config;
        };
        loaderInerceptor.response = function(response) {
            angular.element($el).addClass('hide');
            return response;
        };
        loaderInerceptor.responseError = function(response){
            angular.element($el).addClass('hide');
            return $q.reject(response);
        };
        return loaderInerceptor;
    }]);
