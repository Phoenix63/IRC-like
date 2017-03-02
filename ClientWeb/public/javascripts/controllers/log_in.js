myApp.controller('log_in_controller', function ($scope, $location) {
	$scope.loadChat = function() {
		$location.path("/irc");
		$scope.apply();
	}
});
