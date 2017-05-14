/*jshint esversion: 6 */
angular.module('myapp')
	.factory('AuthService', ['$http', '$q', 'AuthToken', function($http, $q, AuthToken){
	var auth = {user: null};
	
	auth.login = function(userName, password){
		var postData = {
			name: userName,
			password: password
		};
		var deferred = $q.defer();
		$http.post('/api/login', postData).then((response) =>{
			if(response.data && response.data.token);
			AuthToken.setToken(response.data.token);
			deferred.resolve(response.data);
		}, (error) => {
			var errorMsg = "Something wrong";
			console.log('error', error);
			deferred.reject(errorMsg);
		});
		return deferred.promise;
	};

	auth.logout = function(){
		AuthToken.setToken();
	};

	auth.isLoggedIn = function(){
		if(AuthToken.getToken()){
			return true;
		}
		return false;
	};

	auth.getUser = function(){
		if(this.isLoggedIn()){
			var deferred = $q.defer();
			$http.get('/api/me').then((response) => {
				deferred.resolve(response.data);
			}, (error) => {
			var errorMsg = "Something wrong";
			console.log('error', error);
			deferred.reject(errorMsg);
			});
			return deferred.promise;
		}

	};

	return auth;
}]);
