myApp.controller("ircCtrl",function($scope, $location, userInfo) {
	var user = userInfo;
	user.setRight(2);
	var defaultMess = new User("Response");
	defaultMess.setRight(2);
	var boolNames = undefined;
	var boolAskTopic = undefined;
	var countNick = 0;
	var admin = [];
	$scope.currentChannel = new Channel("@accueil");
    $scope.channels = [];
	$scope.topicChannel = "PANDIRC";
	$scope.joinChannel = function(ch) {
		ch.setNotifOff();
		//update
		for(var i = 0; i<$scope.channels.length; i++) {
			if($scope.channels[i].chan === $scope.currentChannel.chan) {
				$scope.channels[i] = $scope.currentChannel;
			}
		}
		$scope.currentChannel = ch;
		$scope.topicChannel = $scope.currentChannel.topic;
	}

	$scope.menuOptions = function(ch) { return [
		["Partir", function ($itemScope) {
			if(ch.chan.includes("#") === false) {
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === ch.chan) {
						if($scope.currentChannel.chan === ch.chan) {
							$scope.channels.splice(i,1);
							if($scope.channels.length === 0) {
								$scope.currentChannel = new Channel("@accueil");
								$scope.topicChannel = "PANDIRC";
								
							}
							else {
								$scope.currentChannel = $scope.channels[$scope.channels.length-1];
								$scope.topicChannel = $scope.currentChannel.topic;
							}
						}
						else {
							$scope.channels.splice(i,1);
						}
						
					}
				}
			}
			else {
				userInfo.socket.emit("message","PART " + ch.chan);
			}
			
		}],
		['Mute', function ($itemScope) {
			ch.setNotifOffTemp();
		}],
		['DeMute', function ($itemScope) {
			ch.setNotifOff();
		}]
	];};
	
	$scope.menuOptionsUser = function(userL) { return [
		["Message", function ($itemScope) {
			
			var boolUser = false;
			//update
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === $scope.currentChannel.chan) {
					$scope.channels[i] = $scope.currentChannel;
				}
			}
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === userL.nick) {
					boolUser = true;
				}
			}
			if(boolUser === true) {
				$scope.currentChannel = $scope.channels[i].chan;
			}
			else {
				$scope.currentChannel = new Whisper(userL.nick);
				$scope.currentChannel.setTopic(userL.nick);
				$scope.topicChannel = $scope.currentChannel.topic;
				$scope.currentChannel.listU.push(user);
				$scope.currentChannel.listU.push(userL);
				$scope.channels.push($scope.currentChannel);
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),  "You talk with " + userL.nick]);
			}
		}],
		["WhoIs", function ($itemScope) {
			userInfo.socket.emit("message","WHOIS " + userL.nick);
		}],
		["Mute", function ($itemScope) {
			if(userL.nick !== user.nick) {
				$scope.currentChannel.mute.push(userL.nick);
			}
			else {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),  "You cannot mute yourself"]);
			}
		}],
		["DeMute", function ($itemScope) {
			$scope.currentChannel.removeMuteList(userL.nick);
		}],
		["Kick", function ($itemScope) {
			//only if admin
		}],
		["Bann", function ($itemScope) {
			//only if admin
		}]
	];};
	
    $scope.sendMessage = function() {
        var cmdJoin = $scope.newMessage.match(/^\/join[ ][\w\S]+$/);
		var cmdPart = $scope.newMessage.match(/^\/part[ ][\w\W]+$/);
		var cmdTopic = $scope.newMessage.match(/^\/topic[ ][#][a-zA-Z0-9]+[ ][\w\W]+$/);
		var cmdTopic1 = $scope.newMessage.match(/^\/topic[ ][#][a-zA-Z0-9]+$/);
		var cmdKick = $scope.newMessage.match(/^\/kick[ ][#][a-zA-Z0-9]+[ ][\w\S]+$/);
		var cmdUser = $scope.newMessage.match(/^\/[a-z]+[ ][\w\S]+$/);
		var cmdMess = $scope.newMessage.match(/^\/msg[ ][\w\S]+[ ][\w\W]+$/);
		var cmdNoParam = $scope.newMessage.match(/^\/[a-z]+$/);
		var cmdMode = $scope.newMessage.match(/^\/mode[ ][\w\W]+$/);
		var cmdInvite = $scope.newMessage.match(/^\/invite[ ][\w\S]+[ ][\w\S]+$/);
		var cmdAway = $scope.newMessage.match(/^\/away[ ][\w\W]+$/);
		var cmdPrivMsg = $scope.newMessage.match(/^\/privmsg[ ][#][\w\S]+[ ][\W\s]+$/);
		if($scope.newMessage.match(/^\/[a-z]+/g)) {
			if(cmdJoin != null) {
				var command = (/^(\/[a-z]+)[ ]([\w\S]+)$/).exec($scope.newMessage);
				var commandParamJoin = command[2];
				var commandJoin = command[1];
				if(commandJoin === "/join") {
					userInfo.socket.emit("message", "JOIN " + commandParamJoin);
					if($scope.currentChannel.chan !== "@accueil") {
						for(var i = 0;i<$scope.channels.length; i++) {
							if(commandParamJoin === $scope.channels[i].chan) {
								$scope.channels[i].setNotifOff();
								$scope.currentChannel = $scope.channels[i];
								$scope.topicChannel = $scope.currentChannel.topic;
							}
						}
					}
				}
			}
			else if(cmdTopic != null) {
				var command = (/^\/[a-z]+[ ]([#][a-zA-Z0-9]+)[ ]([\w\W ]+)$/).exec($scope.newMessage);
				var commandChannel = command[1];
				var commandMess = command[2];
				boolAskTopic = false;
				userInfo.socket.emit("message","TOPIC " + commandChannel + " " + commandMess);
			}
			else if(cmdTopic1 != null) {
				var command = (/^\/[a-z]+[ ]([#][a-zA-Z0-9]+)$/).exec($scope.newMessage);
				boolAskTopic = true;
				userInfo.socket.emit("message","TOPIC " + command[1]);
			}
			else if(cmdPart != null) {
				var command = (/^\/[a-z]+[ ]([\w\W]+)$/).exec($scope.newMessage);
				var commandParamPart = command[1];
				var boolNoPart = false;
				var multiChannel = commandParamPart.split(' ');
				if(multiChannel[multiChannel.length-1][0] === ":") {
					boolNoPart = true;
					var messToPart = multiChannel[multiChannel.length-1];
					for(var i = 0; i<$scope.channels.length; i++) {
						if(multiChannel.includes($scope.channels[i].chan) === true) {
							userInfo.socket.emit("PRIVMSG " + $scope.channels[i].chan + " : " + messToPart);
						}
					}
				}
				if($scope.currentChannel.status === 0) {
					if(boolNoPart === false) {
						for(var i = 0; i<multiChannel.length; i++) {
							userInfo.socket.emit("message","PART " + multiChannel[i]);
						}
					}
					else {
						for(var i = 0; i<multiChannel.length-1; i++) {
							userInfo.socket.emit("message","PART " + multiChannel[i]);
						}
					}	
				}
				else {
					var boolCurrentChan = false;
					if(multiChannel.includes($scope.currentChannel.chan) === true) {
						boolCurrentChan = true;
					}
					for(var i = 0; i<$scope.channels.length; i++) {
						if(multiChannel.includes($scope.channels[i].chan) === true) {
							$scope.channels.splice(i,1);
						}
					}
						
					if(boolCurrentChan === true) {
						if($scope.channels.length !== 0) {
							$scope.currentChannel = $scope.channels[$scope.channels.length-1];
							$scope.topicChannel = $scope.currentChannel.topic;
						}
						else {
							$scope.currentChannel = new Channel("@accueil");
							$scope.topicChannel = "PANDIRC";
						}
					}
				}
			}
			else if(cmdUser != null) {
				var command = (/^(\/[a-z]+)[ ]([\w\S]+)$/).exec($scope.newMessage);
				var commandUser = command[1];
				var paramUser = command[2];
				switch(commandUser) {
					case "/nick":
						userInfo.socket.emit("message", "NICK " + paramUser);
						break;
					case "/who":
						//users in the current channel
						userInfo.socket.emit("message","WHO " + paramUser);
						break;
					case "/whois":
						userInfo.socket.emit("message","WHOIS " + paramUser);
						break;
					case "/names":
						userInfo.socket.emit("message","NAMES " + paramUser);
						break;
					default:
				}
			}
			else if(cmdMess != null) {
				var command = (/^\/msg[ ]([\w\S]+)[ ]([\w\W ]+)$/).exec($scope.newMessage);			
				var paramUser = new User(command[1]);
				var paramMess = command[2];
				var booleUsedWhisp = false;
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === paramUser.nick) {
						booleUsedWhisp = true;
						var counter = i;
					}
				}
				// update
				if($scope.currentChannel.chan !== "@accueil") {
					for(var i = 0; i<$scope.channels.length; i++) {
						if($scope.channels[i].chan === $scope.currentChannel.chan) {
							$scope.channels[i] = $scope.currentChannel;
						}
					}
				}
				if(booleUsedWhisp === true) {
					$scope.channels[counter].setNotifOff();
					$scope.currentChannel = $scope.channels[counter];
				}
				else {
					$scope.currentChannel = new Whisper(paramUser.nick);
					$scope.currentChannel.setTopic(paramUser.nick);
					$scope.topicChannel = $scope.currentChannel.topic;
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You talk with " + paramUser.nick]);
					$scope.currentChannel.listU.push(paramUser);
					$scope.currentChannel.listU.push(user);
					$scope.channels.push($scope.currentChannel);
				}
				userInfo.socket.emit("message","PRIVMSG " + paramUser.nick + " :" + paramMess);
				$scope.currentChannel.messages.push([paramUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), paramMess]);
			}
			else if(cmdNoParam != null) {
				var command = (/^(\/[a-z]+)$/).exec($scope.newMessage);
				var cmd = command[1];
				switch(cmd) {
					case "/part":
						if($scope.currentChannel.chan !== "@accueil") {
							if($scope.currentChannel.status === 0) {
								userInfo.socket.emit("message","PART " + $scope.currentChannel.chan);
							}
							else {
								if($scope.channels.length === 1) {
									$scope.channels.splice(0,1);
									$scope.currentChannel = new Channel("@accueil");
									$scope.topicChannel = "PANDIRC";
								}
								else {
									for(var i = 0; i<$scope.channels.length; i++) {
										if($scope.channels[i].chan === $scope.currentChannel.chan) {
											$scope.channels.splice(i,1);
											$scope.currentChannel = $scope.channels[$scope.channels.length-1];
											$scope.topicChannel = $scope.currentChannel.topic;
										}
									}
								}		
							}
						}
						break;
					case "/names":
						//users on every channel
						boolNames = true;
						userInfo.socket.emit("message","NAMES");
						break;
					case "/list":
						//list every channels with their topic
						userInfo.socket.emit("message","LIST");
						break;
					case "/who":
						if($scope.currentChannel.chan !== "@accueil") {
							userInfo.socket.emit("message","WHO " + $scope.currentChannel.chan);
						}
						else {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You have to join a channel"]);
						}
						break;
					case "/whois":
						if($scope.currentChannel.status === 1) {
							userInfo.socket.emit("message","WHOIS " + $scope.currentChannel.chan);
						}
						else {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You should put a user after your command"]);
						}
						break;
					case "/topic":
						userInfo.socket.emit("message","TOPIC " + $scope.currentChannel.chan);
						break;
					case "/quit":
						//leave the server
						userInfo.socket.emit("message","QUIT");
						break;
	
					default:
				}
			}
			else if(cmdKick !== null) {
				var cmdK = $scope.newMessage.split(" ");
				if(cmdK[1].includes("#")) {
					for(var i = 0; i<$scope.channels.length; i++) {
						if(cmdK[1] === $scope.channels[i].chan) {
							for(var j = 2; j<cmdK.length; j++) {
								userInfo.socket.emit("message", "KICK " + cmdK[1] + " " + cmdK[j]);
							}
						}
						else {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You're not subscribe on that channel"]);
						}
					}
				}
				else {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The second argument must be a channel"]);
				}
			}
			else if(cmdInvite !== null) {
				var cmdInvit = (/^\/invite[ ]([\w\S]+)[ ]([\w\S]+)$/).exec($scope.newMessage);
				var cmdInvitUser = cmdInvit[1];
				var cmdInvitCh = cmdInvit[2];
				userInfo.socket.emit("message", "INVITE " + cmdInvitUser + " " + cmdInvitCh);
			}
			else if(cmdAway !== null) {
				var cmdA = (/^\/away[ ]([\w\W]+)$/).exec($scope.newMessage);
				var cmdAwayMess = cmdA[1];
				userInfo.socket.emit("message", "AWAY " + cmdAwayMess);
			}
			else if(cmdPrivMsg !== null) {
				var cmdPrivMsg = (/^\/privmsg[ ]([#][\w\S]+)[ ]([\W\s]+)$/).exec($scope.newMessage);
				var cmdPrivMsgChan = cmdPrivMsg[1];
				var cmdPrivM = cmdPrivMsg[2];
				userInfo.socket.emit("message", "PRIVMSG " + cmdPrivMsgChan + " : " + cmdPrivM);
			}
			else if(cmdMode !== null) {
				
				var modeL = [[false, "+"], [false, "-"], [false, "o"], [false, "p"], [false, "s"], [false, "i"], [false, "t"], [false, "n"], [false, "m"], [false, "l"], [false, "b"], [false, "v"], [false, "k"], [false, "w"]];
				var boolIsCh = true;
				var cmd = $scope.newMessage.split(" ");
				if(cmd[1].includes("#")) {
					for(var i = 0; i<$scope.channels.length; i++) {
						if(cmd[1] === $scope.channels[i].chan) {
							if(cmd[2].includes("o") && cmd[2][0] === "+" && (cmd[2].includes("l") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("v") === false) && (cmd[2].includes("k") === false)) {
								if(cmd[3] !== undefined  && cmd[3] !== "") {
									modeL[0][0] = true;
									modeL[2][0] = true;
									if(cmd[2].includes("p")) {
										modeL[3][0] =  true;
									}
									if(cmd[2].includes("s")) {
										modeL[4][0] = true;
									}
									if(cmd[2].includes("i")) {
										modeL[5][0] = true;
									}
									if(cmd[2].includes("t")) {
										modeL[6][0] = true;
									}
									if(cmd[2].includes("n")) {
										modeL[7][0] = true;
									}
									if(cmd[2].includes("m")) {
										modeL[8][0] = true;
									}
								}
								else {
									$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
								}
							}
							else if(cmd[2].includes("o") && cmd[2][0] === "-" && (cmd[2].includes("l") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("v") === false) && (cmd[2].includes("k") === false)) {
								if(cmd[3] !== undefined  && cmd[3] !== "") {
									modeL[1][0] = true;
									modeL[2][0] = true;
									if(cmd[2].includes("p") ) {
										modeL[3][0] = true;
									}
									if(cmd[2].includes("s")) {
										modeL[4][0] = true;
									}
									if(cmd[2].includes("i")) {
										modeL[5][0] = true;
									}
									if(cmd[2].includes("t")) {
										modeL[6][0] = true;
									}
									if(cmd[2].includes("n")) {
										modeL[7][0] = true;
									}
									if(cmd[2].includes("m")) {
										modeL[8][0] = true;
									}
								}
								else {
									$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
								}
							}
							else if(cmd[2].includes("l") && cmd[2][0] === "+" && (cmd[2].includes("o") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("v") === false) && (cmd[2].includes("k") === false)) {
								if(cmd[3] !== undefined  && cmd[3] !== "") {
									modeL[9][0] = true;
									modeL[0][0] = true;
									if(cmd[2].includes("p") ) {
										modeL[3][0] = true;
									}
									if(cmd[2].includes("s")) {
										modeL[4][0] = true;
									}
									if(cmd[2].includes("i")) {
										modeL[5][0] = true;
									}
									if(cmd[2].includes("t")) {
										modeL[6][0] = true;
									}
									if(cmd[2].includes("n")) {
										modeL[7][0] = true;
									}
									if(cmd[2].includes("m")) {
										modeL[8][0] = true;
									}
								}
								else {
									$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
								}
							}
							else if(cmd[2].includes("b") && cmd[2][0] === "-" && (cmd[2].includes("o") === false) && (cmd[2].includes("l") === false) && (cmd[2].includes("v") === false) && (cmd[2].includes("k") === false)) {
								if(cmd[3] !== undefined  && cmd[3] !== "") {
									modeL[10][0] = true;
									modeL[0][0] = true;
									if(cmd[2].includes("p") ) {
										modeL[3][0] = true;
									}
									if(cmd[2].includes("s")) {
										modeL[4][0] = true;
									}
									if(cmd[2].includes("i")) {
										modeL[5][0] = true;
									}
									if(cmd[2].includes("t")) {
										modeL[6][0] = true;
									}
									if(cmd[2].includes("n")) {
										modeL[7][0] = true;
									}
									if(cmd[2].includes("m")) {
										modeL[8][0] = true;
									}
								}
								else {
									$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
								}
							}
							else if(cmd[2].includes("b") && cmd[2][0] === "-" && (cmd[2].includes("o") === false) && (cmd[2].includes("l") === false) && (cmd[2].includes("v") === false) && (cmd[2].includes("k") === false)) {
								if(cmd[3] !== undefined  && cmd[3] !== "") {
									modeL[10][0] = true;
									modeL[1][0] = true;
									if(cmd[2].includes("p") ) {
										modeL[3][0] = true;
									}
									if(cmd[2].includes("s")) {
										modeL[4][0] = true;
									}
									if(cmd[2].includes("i")) {
										modeL[5][0] = true;
									}
									if(cmd[2].includes("t")) {
										modeL[6][0] = true;
									}
									if(cmd[2].includes("n")) {
										modeL[7][0] = true;
									}
									if(cmd[2].includes("m")) {
										modeL[8][0] = true;
									}
								}
								else {
									$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
								}
							}
							else if(cmd[2].includes("v") && cmd[2][0] === "+" && (cmd[2].includes("o") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("l") === false) && (cmd[2].includes("k") === false)) {
								if(cmd[3] !== undefined  && cmd[3] !== "") {
									modeL[11][0] = true;
									modeL[0][0] = true;
									if(cmd[2].includes("p") ) {
										modeL[3][0] = true;
									}
									if(cmd[2].includes("s")) {
										modeL[4][0] = true;
									}
									if(cmd[2].includes("i")) {
										modeL[5][0] = true;
									}
									if(cmd[2].includes("t")) {
										modeL[6][0] = true;
									}
									if(cmd[2].includes("n")) {
										modeL[7][0] = true;
									}
									if(cmd[2].includes("m")) {
										modeL[8][0] = true;
									}
								}
								else {
									$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
								}
							}
							else if(cmd[2].includes("v") && cmd[2][0] === "-" && (cmd[2].includes("o") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("l") === false) && (cmd[2].includes("k") === false)) {
								if(cmd[3] !== undefined  && cmd[3] !== "") {
									modeL[11][0] = true;
									modeL[1][0] = true;
									if(cmd[2].includes("p") ) {
										modeL[3][0] = true;
									}
									if(cmd[2].includes("s")) {
										modeL[4][0] = true;
									}
									if(cmd[2].includes("i")) {
										modeL[5][0] = true;
									}
									if(cmd[2].includes("t")) {
										modeL[6][0] = true;
									}
									if(cmd[2].includes("n")) {
										modeL[7][0] = true;
									}
									if(cmd[2].includes("m")) {
										modeL[8][0] = true;
									}
								}
								else {
									$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
								}
							}
							else if(cmd[2].includes("k") && cmd[2][0] === "+" && (cmd[2].includes("o") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("l") === false) && (cmd[2].includes("v") === false)) {
								if(cmd[3] !== undefined  && cmd[3] !== "") {
									modeL[12][0] = true;
									modeL[0][0] = true;
									if(cmd[2].includes("p") ) {
										modeL[3][0] = true;
									}
									if(cmd[2].includes("s")) {
										modeL[4][0] = true;
									}
									if(cmd[2].includes("i")) {
										modeL[5][0] = true;
									}
									if(cmd[2].includes("t")) {
										modeL[6][0] = true;
									}
									if(cmd[2].includes("n")) {
										modeL[7][0] = true;
									}
									if(cmd[2].includes("m")) {
										modeL[8][0] = true;
									}
								}
								else {
									$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put a keyword"]);
								}
							}
							else if(cmd[2].includes("k") && cmd[2][0] === "-" && (cmd[2].includes("o") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("l") === false) && (cmd[2].includes("v") === false)) {
								if(cmd[3] === undefined) {
									modeL[12][0] = true;
									modeL[1][0] = true;
									if(cmd[2].includes("p") ) {
										modeL[3][0] = true;
									}
									if(cmd[2].includes("s")) {
										modeL[4][0] = true;
									}
									if(cmd[2].includes("i")) {
										modeL[5][0] = true;
									}
									if(cmd[2].includes("t")) {
										modeL[6][0] = true;
									}
									if(cmd[2].includes("n")) {
										modeL[7][0] = true;
									}
									if(cmd[2].includes("m")) {
										modeL[8][0] = true;
									}
								}
								else {
									$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You have too much parameter"]);
								}
							}
							else {
								if(cmd[3] === undefined) {
									if(cmd[2][0] === "+" && cmd[2][1] !== undefined) {
										modeL[0][0] = true;
										if(cmd[2].includes("p") ) {
											modeL[3][0] = true;
										}
										if(cmd[2].includes("s")) {
											modeL[4][0] = true;
										}
										if(cmd[2].includes("i")) {
											modeL[5][0] = true;
										}
										if(cmd[2].includes("t")) {
											modeL[6][0] = true;
										}
										if(cmd[2].includes("n")) {
											modeL[7][0] = true;
										}
										if(cmd[2].includes("m")) {
											modeL[8][0] = true;
										}
									}
									else if(cmd[2][0] === "-" && cmd[2][1] !== undefined) {
										modeL[1][0] = true;
										if(cmd[2].includes("p") ) {
											modeL[3][0] = true;
										}
										if(cmd[2].includes("s")) {
											modeL[4][0] = true;
										}
										if(cmd[2].includes("i")) {
											modeL[5][0] = true;
										}
										if(cmd[2].includes("t")) {
											modeL[6][0] = true;
										}
										if(cmd[2].includes("n")) {
											modeL[7][0] = true;
										}
										if(cmd[2].includes("m")) {
											modeL[8][0] = true;
										}
									}
									else {
										$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must add a flag!!"]);
									}
								}
								else {
									$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Check if your flag is compatible and if you have too much argument"]);
								}
							}
							var flag = "";
							for(var j = 0; j<modeL.length; j++) {
								if(modeL[j][0] === true) {
									flag = flag + modeL[j][1];
								}
							}
							if(cmd[3] === undefined) {
								userInfo.socket.emit("message", "MODE " + cmd[1] + " " + flag);
							}
							else {
								userInfo.socket.emit("message", "MODE " + cmd[1] + " " + flag + " " + cmd[3]);
							}
						}
						else {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You're not subscribe on that channel"]);
						}
					}
				}
				else {
					boolIsCh = false;
					if(cmd[1] !== undefined && cmd[1] !== "") {
						if(cmd[2] !== undefined && cmd[2] !== "") {
							if(cmd[2][0] === "+") {
								modeL[0][0] = true;
								if(cmd[2].includes("i")) {
									modeL[5][0] = true;
								}
								if(cmd[2].includes("s")) {
									modeL[4][0] = true;
								}
								if(cmd[2].includes("w")) {
									modeL[13][0] = true;
								}
								if(cmd[2].includes("o")) {
									modeL[2][0] = true;
								}
							}
							else if(cmd[2][0] === "-") {
								modeL[1][0] = true;
								if(cmd[2].includes("i")) {
									modeL[5][0] = true;
								}
								if(cmd[2].includes("s")) {
									modeL[4][0] = true;
								}
								if(cmd[2].includes("w")) {
									modeL[13][0] = true;
								}
								if(cmd[2].includes("o")) {
									modeL[2][0] = true;
								}
							}
							var flag = "";
							for(var i = 0; i<modeL.length; i++) {
								if(modeL[i][0] === true) {
									flag = flag + modeL[i][1];
								}
							}
							if(flag === "") {
								$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "This is not available flag"]);
							}
							else {
								userInfo.socket.emit("message", "MODE " + cmd[1] + " " + flag);
							}
						}
						else {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must have flag"]);
						}
					}
					else {
						$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
					}
				}
			}
			else {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Command invalid"]);
			}
			
			
			$scope.newMessage = undefined;
			
		}
		else if($scope.currentChannel.chan !== "@accueil"){
            userInfo.socket.emit("message","PRIVMSG " + $scope.currentChannel.chan + " : " + $scope.newMessage);
			$scope.currentChannel.messages.push([user, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), $scope.newMessage]);
			$scope.newMessage = undefined;
        }
		else {
			$scope.currentChannel.messages.push([user, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), $scope.newMessage]);
			$scope.newMessage = undefined;
		}
		$scope.$apply();
    }
	
    userInfo.socket.on("message",function(msg) {
		if(msg.match(/^:[\S]+[ ]433[ ][\S]+[ ][\W\w]+$/)) {
			$location.path("/");

		}
        else if(msg.match(/^[:][\w\S]+[ ]PRIVMSG[ ][#][\w\S]+[ ][:][ ][a-zA-Z0-9\W]+$/)) {
            var regxMess = (/^[:]([\w\S]+)[ ]PRIVMSG[ ]([#][\w\S]+)[ ][:][ ]([a-zA-Z0-9\W]+)$/).exec(msg);
			var regxUser = new User(regxMess[1]);
			var regxChannel = regxMess[2];
			var regxMsg = regxMess[3];
			if($scope.currentChannel.chan !== regxChannel) {
				for(var i = 0; i<$scope.channels.length; i++) {
					if(regxChannel === $scope.channels[i].chan) {
						if($scope.channels[i].mute.includes(regxUser.nick) === false) {
							regxUser = isAdmin(regxUser, $scope.channels[i]);
							$scope.channels[i].messages.push([regxUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), regxMsg]);
							if($scope.channels[i].notif !== 2) {
								$scope.channels[i].setNotifOn();
							}
						}
					}
				}
			}
			else {
				if($scope.currentChannel.mute.includes(regxUser.nick) === false) {
					regxUser = isAdmin(regxUser, $scope.currentChannel);
					$scope.currentChannel.messages.push([regxUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), regxMsg]);
				}
			}
			
        }
		else if(msg.match(/^[:][\w\S]+[ ]PRIVMSG[ ][\w\S]+[ ][:][ ][a-zA-Z0-9\W]+$/)) {
			var bool = false;
			var boolMute = false;
			var regxMess = (/^[:]([\w\S]+)[ ]PRIVMSG[ ]([\w\W]+)[ ][:][ ]([a-zA-Z0-9\W]+)$/).exec(msg);
			var regxUser = regxMess[1];
			var regxUser2 = regxMess[2];
			var regxMsg = regxMess[3];
			var whispToAdd = new Whisper(regxUser);
			var userToAdd = new User(regxUser);
			
			// update
			if($scope.currentChannel.chan !== "@accueil") {
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === $scope.currentChannel.chan) {
						$scope.channels[i] = $scope.currentChannel;
					}
				}
			}
			
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === userToAdd.nick) {
					bool = true;
					var count = i;
				}
				if($scope.channels[i].mute.includes(userToAdd.nick)) {
					boolMute = true;
				}
			}
			if(boolMute !== true) {
				if(bool === false) {
					whispToAdd.messages.push([userToAdd, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "talks to you"]);
					whispToAdd.setTopic(userToAdd.nick);
					whispToAdd.messages.push([userToAdd, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), regxMsg]);
					whispToAdd.listU.push(user);
					whispToAdd.listU.push(userToAdd);
					whispToAdd.setNotifOn();
					$scope.channels.push(whispToAdd);
				} 
				else {
					if($scope.currentChannel.chan === regxUser.nick) {
						$scope.currentChannel.messages.push([regxUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), regxMsg]);
					}
					else {
						$scope.channels[count].messages.push([regxUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), regxMsg]);
						if($scope.channels[count].notif !== 2) {
							$scope.channels[count].setNotifOn();
						}
					}
				}
			}
			else {
				userInfo.socket.emit("message","PRIVMSG " + userToAdd.nick + " : You have been mute by this user");
			}
			
		}
        else if(msg.match(/^:[\w\S]+[ ]NICK[ ][\w\S]+$/)) {
            var msgToPush = in_isNickname(msg);
            var oldname = msgToPush[0];
			
			//change the whisp name channel
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === oldname) {
					$scope.channels[i].setChan(msgToPush[1]);
				}
			}
			
			//change the whisp of the current Channel
			if($scope.currentChannel.chan === oldname) {
				$scope.currentChannel.setChan(msgToPush[1]);
			}
			
			//
			if(countNick === 0 ) {
				user.nick = msgToPush[1];
				if($scope.currentChannel.chan === "@accueil") {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You have changed your nick to " + user.nick]);
				}
				countNick = 1;
			}
			
			if(user.nick === oldname) {
				user.setNick(msgToPush[1]);
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You have changed your nick to " + user.nick]);
				$scope.currentChannel.setNickInList(oldname, user.nick);
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.currentChannel.chan !== $scope.channels[i].chan) {
						for(var j = 0; j<$scope.channels[i].listU.length; j++) {
							if($scope.channels[i].listU[j].nick === oldname) {
								$scope.channels[i].setNickInList(oldname, user.nick);
								$scope.channels[i].messages.push([new User(oldname), new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "has changed his nick to " + user.nick]);
								if(($scope.channels[i].chan !== $scope.currentChannel.chan) && ($scope.channels[i].notif !== 2)) {
									$scope.channels[i].setNotifOn();
								}
							}
						}
					}
				}
					
				
			}
			else {
				var newNick = msgToPush[1];
				for(var i = 0; i<$scope.currentChannel.listU.length; i++) {
					if($scope.currentChannel.listU[i].nick === oldname) {
						$scope.currentChannel.setNickInList(oldname, newNick);
						$scope.currentChannel.messages.push([new User(oldname), new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "has changed his nick to " + newNick]);
					}
				}
				
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.currentChannel.chan !== $scope.channels[i]) {
						for(var j = 0; j<$scope.channels[i].listU.length; j++) {
							if($scope.channels[i].listU[j].nick === oldname) {
								$scope.channels[i].setNickInList(oldname, newNick);
								$scope.channels[i].messages.push([new User(oldname), new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "has changed his nick to " + newNick]);
								if(($scope.channels[i].chan !== $scope.currentChannel.chan) && ($scope.channels[i].notif !== 2)) {
									$scope.channels[i].setNotifOn();
								}
							}
						}
					}
				}
			}
        }
		else if(msg.match(/^:[\w\S]+[ ]KICK[ ][#][\w\S]+[ ][\w\S]+$/)) {
			var rspKick = (/^:([\w\S]+)[ ]KICK[ ]([#][\w\S]+)[ ]([\w\S]+)$/).exec(msg);
			var boolCurrKicked = false;
			rspKicker = rspKick[1];
			rspKickCh = rspKick[2];
			rspKicked = rspKick[3];
			
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === rspKickCh) {
					var count = i;
				}
				if($scope.channels[i].chan === $scope.currentChannel.chan) {
					boolCurrKicked = true;
				}
			}
			if(rspKicked === user.nick) {
				if(boolCurrKicked === true) {
					if($scope.channels.length === 1) {
						$scope.channels.splice(0, 1);
						$scope.currentChannel = new Channel("@accueil");
						$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You were kicked from " + rspKickCh + " by " + rspKicker]);
					}
					else {
						$scope.channels.splice(count, 1);
						$scope.currentChannel = $scope.channels[$scope.channels.length-1];
						$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You were kicked from " + rspKickCh + " by " + rspKicker])
					}
				}
				else {
					$scope.channels.splice(count, 1);
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You were kicked from " + rspKickCh + " by " + rspKicker]);
				}
			}
			else {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspKicked + " was kicked from " + rspKickCh + " by " + rspKicker]);
				boolNames = false;
				userInfo.socket.emit("message", "NAMES " + rspKickCh);
			}
		}
        else if(msg.match(/^:[\w\S]+[ ]JOIN[ ][#][\w\S]+$/)) {
			var rspJoin = (/^:([\w\S]+)[ ]JOIN[ ]([#][\w\S]+)$/).exec(msg);
			var bool = false;
			boolNames = false;
			var chanToAdd = new Channel(rspJoin[2]);
			var newUser = new User(rspJoin[1]);
			// update
			if(newUser.nick.includes("@")) {
				var newNick = newUser.nick;
				newNick = newNick.replace("@","");
				newUser.setNick(newNick);
				admin.push(newUser.nick);
			}
			if($scope.currentChannel.chan !== "@accueil") {
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === $scope.currentChannel.chan) {
						$scope.channels[i] = $scope.currentChannel;
					}
				}
			}
			
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === chanToAdd.chan) {
					bool = true;
					var count = i;
				}
			}
			
			if(bool === false) {
				$scope.currentChannel = chanToAdd;
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You have joined the channel " + chanToAdd.chan]);
				$scope.channels.push($scope.currentChannel);
			}
			else {
				
				if(user.nick !== newUser.nick) {
					if($scope.currentChannel.chan !== chanToAdd.chan) {
						$scope.channels[count].messages.push([newUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "has joined the channel " + chanToAdd.chan]);
						if($scope.channels[count].notif !== 2){
							$scope.channels[count].setNotifOn();
						}
					}
					else {
						$scope.currentChannel.messages.push([newUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), " has joined the channel " + chanToAdd.chan]);
					}
				}
			}
			boolNames = false;
			userInfo.socket.emit("message","NAMES " + rspJoin[2]);
        }
		else if(msg.match(/^:[\w\S]+[ ]PART[ ][#][\w\S]+[ ][:][\w\W ]+$/)) {
			var chann = in_isChannel(msg);
			if(user.nick === chann[0]) {
				if($scope.channels.length === 1) {
					$scope.channels.splice(0,1);
					$scope.currentChannel = new Channel("@accueil");
					$scope.topicChannel = "PANDIRC";
				}
				else {
					for(var i = 0; i<$scope.channels.length; i++) {
						if($scope.channels[i].chan === chann[1]) {
							if($scope.currentChannel === $scope.channels[i]) {
								$scope.channels.splice(i,1);
								$scope.currentChannel = $scope.channels[$scope.channels.length-1];
								$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You leave the channel " + chann[1] + " and you join the channel " + $scope.channels[$scope.channels.length-1].chan]);
								$scope.topicChannel = $scope.currentChannel.topic;
							}
							else {
								$scope.channels.splice(i,1);
							}
						}
					}
				}
			}
			else if($scope.currentChannel.chan === chann[1]) {
				boolNames = false;
				userInfo.socket.emit("message","NAMES " + $scope.currentChannel.chan);
				//$scope.currentChannel.removeUser(chann[0]);
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), chann[0] + " leave the channel " + chann[1]]);
			}
			else {
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === chann[1]) {
						boolNames = false;
						//$scope.channels[i].removeUser(chann[0]);
						userInfo.socket.emit("message","NAMES " + $scope.channels[i].chan);
						$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), chann[0] + " leave the channel"]);
						if($scope.channels[i].notif !== 2) {
							$scope.channels[i].setNotifOn();
						}
						
					}
				}
			}
			
		}
		else if(msg.match(/^:[\w\S]+[ ]QUIT[ ][\S\w]+$/)) {
			//quit
			
			var rspQuit = (/^:([\w\S]+)[ ]QUIT[ ][:][\S\w]+$/).exec(msg);
			var rspQuitUser = rspQuit[1];
			rspQuitUser = rspQuitUser.replace("@","");
			if(rspQuitUser === user.nick) {
				$location.path("/");
			}
			else {
				for(var i = 0; i<$scope.channels.length; i++) {
					if(rspQuitUser === $scope.channels[i].chan) {
						$scope.channels.splice(i, 1);
					}
				}
			}
		}
		else if(msg.includes("PING")===true) {
			userInfo.socket.emit("message", "PONG");
		}
		else if(msg.match(/^[\w\S]+[ ]341[ ][\S\w]+[ ][\w\S]+$/)) {
			var rspInvite = (/^[\w\S]+[ ]341[ ]([\S\w]+)[ ]([\w\S]+)$/).exec(msg);
			var rspInviteChan = rspInvite[2];
			var rspInviteUser = rspInvite[1];
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You have invited " + rspInviteUser + " on the channel " + rspInviteChan]);
		}
		else if(msg.match(/^[\S\w]+[ ]641[ ][\w\S]+[ ][\w\S]+$/)) {
			var rspInvited = (/^[\S\w]+[ ]641[ ]([\w\S]+)[ ]([\w\S]+)$/).exec(msg);
			var rspInvitedCh = rspInvited[2];
			var rspInvitedUser = rspInvited[1];
			if(confirm("You have been invited on the channel " + rspInvitedCh + " by " + rspInvitedUser + ", join now ?")) {
				userInfo.socket.emit("message", "JOIN " + rspInvitedCh);
			}
			else {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You refused the invitation but you could join at every moment"]);
			}
		}
		else if(msg.match(/^[:][0-9.a-z:]+[ ]352[ ][\S]+[ ][\S]+[ ][\S]+[ ][\S]+[ ][\S]+[ ][\S]+[ ][\S]+[ ][\S]+[ ]+[\S]+$/)) {
			var rspWho = (/^:[0-9.a-z:]+[ ]352[ ][\w\S]+[ ]([\w\S]+)[ ][\w\S]+[ ][\w\W]+[ ][\w\S]+[ ]([\w\S]+)[ ]([\w\S]+)[ ][\w\S]+[ ]+([\w\S]+)$/).exec(msg);
			var rspChan = rspWho[1];
			var rspUserId = rspWho[2];
			var rspUserRight = rspWho[3];
			var rspUserRealN = rspWho[4];
			if(rspUserRight.includes("H@")) {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "RealName : " + rspUserRealN + ", userId : " + rspUserId + " is an operator and is active"]);
			}
			else if(rspUserRight.includes("H+")) {
				$scope.currenChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "RealName : " + rspUserRealN + ", userId : " + rspUserId + " is voice and is active"]);
			}
			else if(rspUserRight.includes("H")) {
				$scope.currenChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "RealName : " + rspUserRealN + ", userId : " + rspUserId + " is active"]);
			}
			else if(rspUserRight.includes("G@")) {
				$scope.currenChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "RealName : " + rspUserRealN + ", userId : " + rspUserId + " is an operator and is away"]);
			}
			else if(rspUserRight.includes("G+")) {
				$scope.currenChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "RealName : " + rspUserRealN + ", userId : " + rspUserId + " is voice and is away"]);
			}
			else if(rspUserRight.includes("G")) {
				$scope.currenChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "RealName : " + rspUserRealN + ", userId : " + rspUserId + " is gone"]);
			}
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ]353[ ][\w\S]+[ ][\S\w][ ][#][\w\S]+[ ][:][\w\W]+$/)) {
			var isNames = in_isNames(msg);
			var channelSet = isNames[2];
			var usersN = isNames[1];
			var mNames = "";
			var channelName = isNames[0];
			if(boolNames === false) { // refresh users list in every channels
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === channelName) {
						$scope.channels[i].listU = usersN;
						if(channelSet === "=") {
							$scope.channels[i].setRight(0);
						}
						else if(channelSet === "@") {
							$scope.channels[i].setRight(1);
						}
						else {
							$scope.channels[i].setRight(2);
						}
					}
				}
				if($scope.currentChannel.chan === channelName) {
					$scope.currentChannel.listU = usersN;
					if(channelSet === "=") {
						$scope.currentChannel.setRight(0);
					}
					else if(channelSet === "@") {
						$scope.currentChannel.setRight(1);
					}
					else {
						$scope.currentChannel.setRight(2);
					}
				}
				for(var i = 0; i<$scope.currentChannel.listU.length; i++) {
					if(admin.includes($scope.currentChannel.listU[i])) {
						$scope.currentChannel.listU[i].setRight(3);
					}
				}
				$scope.channels = isAdmin1(admin, $scope.channels);
				
			}
			else {
				for(var i = 0; i<usersN.length; i++) {
					if(usersN[i].right === 1) {
						mNames = "(Operateur) " + usersN[i].nick + ", " + mNames;
					}
					else if(usersN[i].right === 2) {
						mNames = "(Admin) " + usersN[i].nick + ", " + mNames;
					}
					else {
						mNames = usersN[i].nick + ", " + mNames;
					}
					
				}
				if(channelSet === "=") {
					mNames = "User(s) in the public channel " + channelName + " : " + mNames;
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), mNames]);
				}
				else if(channelSet === "@") {
					mNames = "User(s) in the secret channel " + channelName + " : " + mNames;
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), mNames]);
				}
				else {
					mNames = "User(s) in the private channel " + channelName + " : " + mNames;
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), mNames]);
				}
				
			}
			
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ]324[ ]MODE[ ][#][\S\w]+[ ][\w\S]+$/)) {
			var rspMode = (/^:[0-9.a-z:]+[ ]324[ ]MODE[ ]([#][\S\w]+)[ ]([\w\S]+)$/).exec(msg);
			var rspModeCh = rspMode[1];
			var rspModeFlag = rspMode[2];
			if(rspModeFlag === "-k") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " don't have a password anymore"]);
			}
			else if(rspModeFlag === "+p") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is now private"]);
			}
			else if(rspModeFlag === "-p") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is not private"]);
			}
			else if(rspModeFlag === "+s") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is now secret"]);
			}
			else if(rspModeFlag === "-s") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is not secret anymore"]);
			}
			else if(rspModeFlag === "+i") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is in invite-mode"]);
			}
			else if(rspModeFlag === "-i") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is not in invite mode anymore"]);
			}
			else if(rspModeFlag === "+t") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The topic of the channel " + rspModeCh + " is now available in modification only by operators"]);
			}
			else if(rspModeFlag === "-t") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Everyone could modify the topic of the channel " + rspModeCh]);
			}
			else if(rspModeFlag === "+n") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " could not receive message from away"]);
			}
			else if(rspModeFlag === "-n") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " could receive messsage from away"]);
			}
			else if(rspModeFlag === "+m") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is now moderate"]);
			}
			else if(rspModeFlag === "-m") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is not moderate"]);
			}
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ]324[ ]MODE[ ][#][\S\w]+[ ][\w\S]+[ ][\w\S]+$/)) {
			var rspMode = (/^:[0-9.a-z:]+[ ]324[ ]MODE[ ]([#][\S\w]+)[ ]([\w\S]+)[ ]([\w\S]+)$/).exec(msg);
			var rspModeCh = rspMode[1];
			var rspModeFlag = rspMode[2];
			var rspModeUser = rspMode[3];
			if(rspModeFlag === "+o") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " is now operator in " + rspModeCh]);
			}
			else if(rspModeFlag === "+k") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " have a password and the password is " + rspModeUser]);
			}
			else if(rspModeFlag === "-o") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " is now simple user in " + rspModeCh]);
			}
			else if(rspModeFlag === "+v") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " coundn't talk in the channel " + rspModeCh]);
			}
			else if(rspModeFlag === "-v") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " could talk in the channel " + rspModeCh]);
			}
			else if(rspModeFlag === "+l") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The limit of users is  " + rspModeUser + " on " + rspModeCh]);
			}
			else if(rspModeFlag === "-l") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The limit of users is  " + rspModeUser + " on " + rspModeCh]);
			}
			else if(rspModeFlag === "+b") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " is now banned from " + rspModeCh]);
			}
			else if(rspModeFlag === "-b") {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " coundn't join the " + rspModeCh]);
			}
		}
		else if(msg.match(/^:[\S]+[ ]221[ ]MODE[ ][\S]+[ ][\S]+$/)) {
			
		}
		else if(msg.match(/^[\S\w]+[ ]401[ ][\W\w]+$/)) {
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "This user isn't in the server or the channel doesn't exist"]);
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ]467[\w\W]+$/)) {
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The key is already set"]);
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ]331[ ]JOIN[ ][#][\w\S]+[ ][:][\w\S ]+$/)) {
			var topic = in_isTopic(msg);
			$scope.currentChannel.setTopic(topic[0] + " :" + topic[1]);
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Topic -> " + topic[1]]);
			$scope.topicChannel = $scope.currentChannel.topic;
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ]331[ ]TOPIC[ ][#][\w\S]+[ ][:][\w\S ]+$/)) {
			var cmdTopic = (/^:[0-9.a-z:]+[ ]331[ ]TOPIC[ ]([#][\w\S]+)[ ][:]([\w\S ]+)$/).exec(msg);
			var channelTopic = cmdTopic[1];
			var messTopic = cmdTopic[2];
			
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ]332[ ][a-zA-Z]+[ ][#][\w\S]+[ ][:][\w\S ]+$/)) {
			var command = (/^:[0-9.a-z:]+[ ]332[ ]TOPIC[ ]([#][\w\S]+)[ ][:]([\w\S ]+)$/).exec(msg);
			var commandChannel = command[1];
			var commandMsg = command[2];
			if(boolAskTopic !== true) {
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === commandChannel) {
						$scope.channels[i].setTopic = commandChannel + " : " + commandMsg;
						if($scope.currentChannel.chan === commandChannel) {
							$scope.topicChannel = commandChannel + " : " + commandMsg;
						}
					}
				}
			}
			else {
				$scope.currenChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Topic -> " + commandMsg]);
			}
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][2][2][ ][\S]+[ ][#][\w\S]+[ ][\W]+[ ][:][\w\W ]+$/)) {
			var list = in_isList(msg);
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Channel : " + list[0] + " with " + list[1] + " user(s) - Topic ->" + list[2]]);
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][7][2][ ][:][-][ ][\w\S]+$/)) { 
            $scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Welcome " + user.realName]);
        }
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][1][1][ ][\S\w]+[ ][\S\w]+[ ][0-9.]+[ ][*][ ][:][ ][\w\W]+$/)) {
			var regXpTab = (/^:[0-9.]+[ ][3][1][1][ ]([\S\w]+)[ ]([\w\S]+)[ ][0-9.]+[ ][*][ ][:][ ]([\w\S]+)$/).exec(msg);
			if(regXpTab[2].includes("GUEST")===true) {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Nickname : " + regXpTab[1] + " is a Guest"]);
			}
			else {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Nickname : " + regXpTab[1] + " and his ID is " + regXpTab[2] + " - Realname : " + regXpTab[3]]);
			}
			
		}
		else if(msg.match(/^[\S]+[ ]475[ ][\S\w\W]+\(\+k\)$/)) {
			var rspKeyWord = (/^[\S\w]+[ ]475[ ]([\S\w\W]+)\(\+k\)$/).exec(msg);
			var rspKeyChn = rspKeyWord[1];
			scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspKeyChn + " have a keyword"]);
		}
		else if(msg.match(/^[\w\S]+[ ]473[ ][#][\w\S]+[ ][\W\w]+\(\+i\)$/)) {
			var rspJoinI = (/^[\w\S]+[ ]473[ ]([#][\w\S]+)[ ][\W\w]+\(\+i\)$/).exec(msg);
			var rspChanI = rspJoinI[1];
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspChanI + " could only be join if you're invited"]);
		}
		else if(msg.match(/^[\w\S]+[ ]482[ ][#][\w\S]+[ ][\W\w]+$/)) {
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "you are not operator in this channel"]);
		}
		
		$scope.currentChannel.messages.push([new User("debug"), new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), msg]);
		$scope.$apply();
    });


});
