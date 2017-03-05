myApp.controller("ircCtrl",function($scope) {
	var user = new User();
	var defaultMess = new User("Server response"); // if there is no user in the sender message
	defaultMess.setRight(2);
	var boolNames = undefined;
	var countNick = 0;
	var admin = [];
    socket.emit("message","USER Gil6300 0 * : " + user.realName);
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
				socket.emit("message","PART " + ch.chan);
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
			socket.emit("message","WHOIS " + userL.nick);
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
        var cmdJoin = $scope.newMessage.match(/^\/[a-z]+[ ][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+$/);
		var cmdPart = $scope.newMessage.match(/^\/[a-z]+[ ][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+, ]+$/);
		var cmdTopic = $scope.newMessage.match(/^\/[a-z]+[ ][#][a-zA-Z0-9]+[ ][\w\W ]+$/);
		var cmdTopic1 = $scope.newMessage.match(/^\/[a-z]+[ ][#][a-zA-Z0-9]+$/);
		var cmdUser = $scope.newMessage.match(/^\/[a-z]+[ ][\w_\-é"'ëäïöüâêîôûç`è]+$/);
		var cmdMess = $scope.newMessage.match(/^\/[a-z]+[ ][\w_\-é"'ëäïöüâêîôûç`è]+[ ][\w\W ]+$/);
		var cmdNoParam = $scope.newMessage.match(/^\/[a-z]+$/);
		if($scope.newMessage.match(/^\/[a-z]+/g)) {
			if(cmdJoin != null) {
				var command = (/^(\/[a-z]+)[ ]([\w#&é"'\è_çà@€^$:!ù;¨?%£*\-*\/+]+)$/).exec($scope.newMessage);
				var commandParamJoin = command[2];
				var commandJoin = command[1];
				if(commandJoin === "/join") {
					socket.emit("message", "JOIN " + commandParamJoin);
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
			
			if(cmdTopic != null) {
				var command = (/^\/[a-z]+[ ]([#][a-zA-Z0-9]+)[ ]([\w\W ]+)$/).exec($scope.newMessage);
				var commandChannel = command[1];
				var commandMess = command[2];
				socket.emit("message","TOPIC " + commandChannel + " " + commandMess);
			}
			if(cmdTopic1 != null) {
				var command = (/^\/[a-z]+[ ]([#][a-zA-Z0-9]+)$/).exec($scope.newMessage);
				
				socket.emit("message","TOPIC " + command[1]);
			}
			if(cmdPart != null) {
				var command = (/^(\/[a-z]+)[ ]([\w#&é"'\è_çà@€^$:!ù;¨?%£*\-*\/+ ]+)$/).exec($scope.newMessage);
				var commandPart = command[1];
				var commandParamPart = command[2];
				var boolNoPart = false;
				if(commandPart === "/part") {
					var multiChannel = commandParamPart.split(' ');
					if(multiChannel[multiChannel.length-1][0] === ":") {
						boolNoPart = true;
						var messToPart = multiChannel[multiChannel.length-1];
						for(var i = 0; i<$scope.channels.length; i++) {
							if(multiChannel.includes($scope.channels[i].chan) === true) {
								socket.emit("PRIVMSG " + $scope.channels[i].chan + " : " + messToPart);
							}
						}
					}
					if($scope.currentChannel.status === 0) {
						if(boolNoPart === false) {
							for(var i = 0; i<multiChannel.length; i++) {
								socket.emit("message","PART " + multiChannel[i]);
							}
						}
						else {
							for(var i = 0; i<multiChannel.length-1; i++) {
								socket.emit("message","PART " + multiChannel[i]);
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
			}
			if(cmdUser != null) {
				var command = (/^(\/[a-z]+)[ ]([\w_\-é"'ëäïöüâêîôûç`è]+)$/).exec($scope.newMessage);
				var commandUser = command[1];
				var paramUser = command[2];
				switch(commandUser) {
					case "/nick":
						socket.emit("message", "NICK " + paramUser);
						break;
					case "/who":
						//users in the current channel
						socket.emit("message","WHO " + paramUser);
						break;
					case "/whois":
						socket.emit("message","WHOIS " + paramUser);
						break;
					default:
				}
			}
			if(cmdMess != null) {
				var command = (/^(\/[a-z]+)[ ]([\w_\-é"'ëäïöüâêîôûç`è]+)[ ]([\w\W ]+)$/).exec($scope.newMessage);
				var commandMess = command[1];
				
				var paramUser = new User(command[2]);
				var paramMess = command[3];
				if(commandMess === "/msg") {
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
					socket.emit("message","PRIVMSG " + paramUser.nick + " :" + paramMess);
					$scope.currentChannel.messages.push([paramUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), paramMess]);
				}
			}
			if(cmdNoParam != null) {
				var command = (/^(\/[a-z]+)$/).exec($scope.newMessage);
				var cmd = command[1];
				switch(cmd) {
					case "/part":
						if($scope.currentChannel.chan !== "@accueil") {
							if($scope.currentChannel.status === 0) {
								socket.emit("message","PART " + $scope.currentChannel.chan);
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
						socket.emit("message","NAMES");
						break;
					case "/list":
						//list every channels with their topic
						socket.emit("message","LIST");
						break;
					case "/who":
						if($scope.currentChannel.chan !== "@accueil") {
							socket.emit("message","WHO " + $scope.currentChannel.chan);
						}
						else {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You have to join a channel"]);
						}
						break;
					case "/whois":
						if($scope.currentChannel.status === 1) {
							socket.emit("message","WHOIS " + $scope.currentChannel.chan);
						}
						else {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You should put a user after your command"]);
						}
						break;
					case "/topic":
						socket.emit("message","TOPIC " + $scope.currentChannel.chan);
						break;
					case "/quit":
						//leave the server
						socket.emit("message","QUIT");
						break;
	
					default:
				}
			}
			
			$scope.newMessage = undefined;
			
		}
		else if($scope.currentChannel.chan !== "@accueil"){
			user.setRight(2);
            socket.emit("message","PRIVMSG " + $scope.currentChannel.chan + " : " + $scope.newMessage);
            $scope.currentChannel.messages.push([user, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), $scope.newMessage]);
			$scope.newMessage = undefined;
        }
		else {
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Command invalid"]);
			$scope.newMessage = undefined;
		}
		$scope.$apply();
    }
	
    socket.on("message",function(msg) {
		
        if(msg.match(/^[:][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]PRIVMSG[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+[ ][:][ ][a-zA-Z0-9 \W]+$/)) {
            var regxMess = (/^[:]([a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+)[ ]PRIVMSG[ ]([#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+)[ ][:][ ]([a-zA-Z0-9 \W]+)$/).exec(msg);
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
		else if(msg.match(/^[:][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]PRIVMSG[ ][\w\W]+[ ][:][ ][a-zA-Z0-9 \W]+$/)) {
			var bool = false;
			var boolMute = false;
			var regxMess = (/^[:]([a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+)[ ]PRIVMSG[ ]([\w\W]+)[ ][:][ ]([a-zA-Z0-9 \W]+)$/).exec(msg);
			var regxUser = new User(regxMess[1]);
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
				socket.emit("message","PRIVMSG " + userToAdd.nick + " : You have been mute by this user");
			}
			
		}
        else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]NICK[ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+$/)) {
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
				boolNames = false;
				socket.emit("message","NAMES " + $scope.currentChannel.chan);
				//$scope.currentChannel.listU.push(newUser);
				$scope.channels.push($scope.currentChannel);
			}
			else {
				
				if(user.nick !== newUser.nick) {
					if($scope.currentChannel.chan !== chanToAdd.chan) {
						$scope.channels[count].messages.push([newUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "has joined the channel " + chanToAdd.chan]);
						if($scope.channels[count].notif !== 2){
							$scope.channels[count].setNotifOn();
						}
						boolNames = false;
						socket.emit("message","NAMES " + $scope.channels[count].chan);
						//$scope.channels[count].listU.push(newUser);
					}
					else {
						$scope.currentChannel.messages.push([newUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), " has joined the channel " + chanToAdd.chan]);
						boolNames = false;
						socket.emit("message","NAMES " + $scope.currentChannel.chan);
						//$scope.currentChannel.listU.push(newUser);
					}
				}
			}
        }
		else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]PART[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+[ ][:][\w\W ]+$/)) {
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
				socket.emit("message","NAMES " + $scope.currentChannel.chan);
				//$scope.currentChannel.removeUser(chann[0]);
				$scope.currentChannel.messages.push([new User(chann[0]), new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), " leave the channel " + chann[1]]);
			}
			else {
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === chann[1]) {
						boolNames = false;
						//$scope.channels[i].removeUser(chann[0]);
						socket.emit("message","NAMES " + $scope.channels[i].chan);
						$scope.channels[i].messages.push([new User(chann[0]), new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), " leave the channel"]);
						if($scope.channels[i].notif !== 2) {
							$scope.channels[i].setNotifOn();
						}
						
					}
				}
			}
			
		}
		else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]QUIT[ ][:][\S\w]+$/)) {
			//quit
			alert("dans quit");
		}
		else if(msg.includes("PING")===true) {
			socket.emit("message", "PONG");
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][5][2][ ][\w\S]+[ ][#][\w\S]+[ ][\w\S]+[ ][\w\W]+[ ][\w\S]+[ ][\w\S]+[ ][\w\S]+[ ][\w\S]+[ ][\w\S]+$/)) {
			var rspWho = (/^:[0-9.a-z:]+[ ][3][5][2][ ][\w\S]+[ ]([#][\w\S]+)[ ][\w\S]+[ ][\w\W]+[ ][\w\S]+[ ]([\w\S]+)[ ]([\w\S]+)[ ][\w\S]+[ ]([\w\S]+)$/).exec(msg);
			var rspChan = rspWho[1];
			var rspUserId = rspWho[2];
			var rspUserRight = rspWho[3];
			var rspUserRealN = rspWho[4];
			if(rspUserRight.includes("H@")) {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), ""]);
			}
			else if(rspUserRight.includes("H+")) {
				$scope.currenChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), ""]);
			}
			else if(rspUserRight.includes("H")) {
				$scope.currenChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), ""]);
			}
			else if(rspUserRight.includes("G@")) {
				$scope.currenChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), ""]);
			}
			else if(rspUserRight.includes("G+")) {
				$scope.currenChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), ""]);
			}
			else if(rspUserRight.includes("G")) {
				$scope.currenChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), ""]);
			}
			
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][5][3][ ][a-zA-Z]+[ ][\S\w][ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+[ ][:][@a-zA-Z0-9 ]+$/)) {
			var isNames = in_isNames(msg);
			var usersN = isNames[1];
			var mNames = "";
			var channelName = isNames[0];
			if(boolNames === false) { // refresh users list in every channels
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === channelName) {
						$scope.channels[i].listU = usersN;
					}
				}
				if($scope.currentChannel.chan === channelName) {
					$scope.currentChannel.listU = usersN;
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
					
				}
				mNames = "User(s) in the channel " + channelName + " : " + mNames;
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), mNames]);
			}
			
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][2][2][1][ ][\w\W]+[ ][\w\W]+$/)) {
			var welcome = (/^:[0-9.a-z:]+[ ][2][2][1][ ]([\w\W]+)[ ][\w\W]+$/).exec(msg);
			user.setNick(welcome[1]);
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][7][2][ ][:][-][ ][a-zA-Z]+[ ][\w\W]+$/)) {
			var welcome = (/^:[0-9.a-z:]+[ ][3][7][2][ ][:][-][ ][a-zA-Z]+[ ]([\w\W]+)$/).exec(msg);
			user.setNick(welcome[1]);
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][3][1][ ]TOPIC[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+[ ][:][a-zA-Z0-9 ,?;.\/!§ù%*µ$£^=+)@àç_è\-('"é&²]+$/)) {
			var topic = in_isTopic(msg);
			
			$scope.currentChannel.setTopic(topic[0] + " :" + topic[1]);
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Topic -> " + topic[1]]);
			$scope.topicChannel = $scope.currentChannel.topic;
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][3][2][ ][a-zA-Z]+[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+[ ][:][a-zA-Z0-9 ,?;.\/!§ù%*µ$£^=+)@àç_è\-('"é&²]+$/)) {
			var command = (/^:[0-9.a-z:]+[ ][3][3][2][ ]TOPIC[ ]([#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+)[ ][:]([a-zA-Z0-9 ,?;.\/!§ù%*µ$£^=+)@àç_è\-('"é&²]+)$/).exec(msg);
			var commandChannel = command[1];
			var commandMsg = command[2];
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === commandChannel) {
					$scope.channels[i].setTopic = commandChannel + " : " + commandMsg;
					if($scope.currentChannel.chan === commandChannel) {
						$scope.topicChannel = commandChannel + " : " + commandMsg;
					}
				}
			}
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][2][2][ ][a-z]+[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+[ ][0-9]+[ ][:][\w\W ]+$/)) {
			var list = in_isList(msg);
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Channel : " + list[0] + " with " + list[1] + " user(s) - Topic ->" + list[2]]);
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][7][2][ ][:][-][ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+$/)) { 
            $scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Welcome " + user.realName]);
        }
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][1][1][ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+[ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+[ ][0-9.]+[ ][*][ ][:][ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+$/)) {
			var regXpTab = (/^:[0-9.]+[ ][3][1][1][ ]([a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+)[ ]([a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+)[ ][0-9.]+[ ][*][ ][:][ ]([a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+)$/).exec(msg);
			if(regXpTab[2].includes("GUEST")===true) {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Nickname : " + regXpTab[1] + " is a Guest"]);
			}
			else {
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Nickname : " + regXpTab[1] + " and his ID is " + regXpTab[2] + " - Realname : " + regXpTab[3]]);
			}
			
		}
		
		
		$scope.$apply();
    });


});
