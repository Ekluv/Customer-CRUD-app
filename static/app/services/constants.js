/*jshint esversion: 6 */
angular.module('myapp')
	.constant('constants', getConstants());


function getConstants() {
	var constants = {
		CUSTOMER_LIST: 'api/customers',
		CREATE_CUSTOMER: 'api/customer',
		DELETE_CUSTOMER: 'api/customer',
		GET_CUSTOMER: 'api/customer',
		UPDATE_CUSTOMER: 'api/customer',
		GENERATE_REPORT: 'api/report'
	};
	return constants;
}