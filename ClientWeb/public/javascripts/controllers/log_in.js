myApp.controller('log_in_controller', function ($scope, $location, userInfo) {
	$scope.logIn = function() {
		console.log($scope.nickname);
		if($scope.nickname === undefined) {
			userInfo.connect();
			userInfo.socket.emit("message", "USER " + userInfo.userN + " 0 * : " + userInfo.realName);
			userInfo.afterConnection();
			userInfo.socket.emit("message", "NICK " + userInfo.nick);
			$location.path("/irc");
		} else {
			userInfo.setUser($scope.nickname, $scope.id);
			if($scope.server !== undefined) {
			userInfo.setServer($scope.server, $scope.port);
			}
			console.log("Connecting to " + userInfo.server + ":" + userInfo.port + " as " + userInfo.userN);
			userInfo.connect();
			if($scope.password === undefined) {
			userInfo.socket.emit("message", "USER " + userInfo.userN + " 0 * : " + userInfo.realName);
			userInfo.afterConnection();
			userInfo.socket.emit("message", "NICK " + userInfo.nick);
			$location.path("/irc");
			} else {
			userInfo.socket.emit("message", "PASS " + $scope.password);
			userInfo.socket.emit("message", "USER " + userInfo.userN + " 0 * : " + userInfo.realName);
			userInfo.socket.emit("message", "NICK " + userInfo.nick);
			$location.path("/irc");
		}
	}
	}
});