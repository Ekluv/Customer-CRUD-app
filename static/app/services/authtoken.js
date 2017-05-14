angular.module('myapp')
	.factory('AuthToken', function(){
		var authToken = {};
		
		authToken.setToken = function(token){
			if(token){
				window.localStorage.setItem('token', token);
			}
			else{
				window.localStorage.removeItem('token');
			}
		};

		authToken.getToken = function(){
			return window.localStorage.getItem('token');
		};

		return authToken;

	});