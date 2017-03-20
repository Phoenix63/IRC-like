myApp.controller('log_in_controller', function ($scope, $location, userInfo) {
	$scope.logIn = function() {
		if($scope.isSetServer() && $scope.isSetPort()) {
			userInfo.setServer($scope.server);
			userInfo.setPort($scope.port);
		} else if($scope.isSetServer() && !($scope.isSetPort())) {
			userInfo.setServer($scope.server);
		}
		userInfo.connect();

		if(!($scope.isSetNick()) && !($scope.isSetId())) {
			userInfo.socket.emit("message", "USER " + userInfo.userN + " 0 * : " + userInfo.realName);
			userInfo.afterConnection();
			userInfo.socket.emit("message", "NICK " + userInfo.nick);
			$location.path("/irc");
		} else if($scope.isSetNick() && !($scope.isSetId())) {
			userInfo.socket.emit("message", "USER " + userInfo.userN + " 0 * : " + userInfo.realName);
			userInfo.setNick($scope.nickname);
			userInfo.afterConnection();
			userInfo.socket.emit("message", "NICK " + userInfo.nick);
			$location.path("/irc");
		} else {
			if(!($scope.isSetNick()) && $scope.isSetId()) {
				userInfo.setReal($scope.id);
				userInfo.socket.emit("message", "PASS " + $scope.password);
			}  else if($scope.isSetNick() && $scope.isSetId()) {
				userInfo.setUser($scope.id, $scope.id);
				userInfo.socket.emit("message", "PASS " + $scope.password);
			} else {
				console.log("Une erreur s'est produite ///Identification");
			}
			userInfo.socket.emit("message", "USER " + userInfo.userN + " 0 * : " + userInfo.realName);
			userInfo.socket.emit("message", "NICK " + userInfo.nick);
			$location.path("/irc");
		}
		console.log("Connecting to " + userInfo.server + ":" + userInfo.port + " as " + userInfo.userN);
		console.log("valid? "+$scope.valid());
	}
	$scope.isSetNick = function() {
		if($scope.nickname === undefined || $scope.nickname === "") {
			return false;
		} else {
			return true;
		}
	}
	$scope.isSetId = function() {
		if($scope.id === undefined || $scope.id === "") {
			return false;
		} else {
			return true;
		}
	}
	$scope.isSetPassword = function() {
		if($scope.password === undefined || $scope.password === "") {
			return false;
		} else {
			return true;
		}
	}
	$scope.isSetServer = function() {
		if($scope.server === undefined || $scope.server === "") {
			return false;
		} else {
			return true;
		}
	}
	$scope.isSetPort = function() {
		if($scope.port === undefined || $scope.port === "") {
			return false;
		} else {
			return true;
		}
	}
	$scope.valid = function() {
		if($scope.isSetPassword() && $scope.isSetId() && ($scope.port === undefined || $scope.port === "" || typeof($scope.port) === 'number')) {
			return true;
		} else if(!($scope.isSetPassword()) && !($scope.isSetId()) && ($scope.port === undefined || $scope.port === "" || typeof($scope.port) === 'number')) {
			return true;
		} else {
			return false;
		}
	}
});