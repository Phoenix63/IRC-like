myApp.controller("ircCtrl",function($scope) {
    var realN = "Guest";
	var boolNames = undefined;
	var countNick = 0;
    socket.emit("message","USER Gil630 0 * : " + realN);
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
				if($scope.channels[i].chan === userL) {
					boolUser = true;
					
				}
			}
			if(boolUser === true) {
				$scope.currentChannel = $scope.channels[i].chan;
			}
			else {
				$scope.currentChannel = new Whisper(userL);
				$scope.currentChannel.setTopic(userL);
				$scope.topicChannel = $scope.currentChannel.topic;
				$scope.currentChannel.listU.push(nick);
				$scope.currentChannel.listU.push(userL);
				$scope.channels.push($scope.currentChannel);
				$scope.currentChannel.messages.push("You talk with " + userL);
			}
		}]
	];};
	
	
    $scope.sendMessage = function() {
        var cmdJoin = $scope.newMessage.match(/^\/[a-z]+[ ][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+$/);
		var cmdPart = $scope.newMessage.match(/^\/[a-z]+[ ][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+, ]+$/);
		var cmdTopic = $scope.newMessage.match(/^\/[a-z]+[ ]#[a-zA-Z0-9]+[ ][\w\W ]$/);
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
				var command = (/^\/[a-z]+[ ](#[a-zA-Z0-9]+)[ ]([\w\W ]+)$/).exec($scope.newMessage);
				var commandChannel = command[1];
				var commandMess = command[2];
				socket.emit("message","TOPIC " + commandChannel + " " + commandMess);
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
						var boolWhoIs = false
						if($scope.channels.length !== 0) {
							for(var i = 0; i<$scope.channels.length; i++) {
								if($scope.channels[i].listU.includes(paramUser) === true) {
									boolWhoIs = true;
								}
							}
							if(boolWhoIs === true) {
								socket.emit("message","WHOIS " + paramUser);
							}
							else {
								$scope.currentChannel.messages.push("You should have a channel in common");
							}
						}
						break;
					default:
				}
			}
			if(cmdMess != null) {
				var command = (/^(\/[a-z]+)[ ]([\w_\-é"'ëäïöüâêîôûç`è]+)[ ]([\w\W ]+)$/).exec($scope.newMessage);
				var commandMess = command[1];
				var paramUser = command[2];
				var paramMess = command[3];
				if(commandMess === "/msg") {
					var booleUnkownNick = false;
					var booleUsedWhisp = false;
					for(var i = 0; i<$scope.channels.length; i++) {
						if($scope.channels[i].listU.includes(paramUser) === true) {
							booleUnkownNick = true;
						}
						if($scope.channels[i].chan === paramUser) {
							booleUsedWhisp = true;
							var counter = i;
						}
					}
					// update
					if(booleUnkownNick === true) {
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
							$scope.currentChannel = new Whisper(paramUser);
							$scope.currentChannel.setTopic(paramUser);
							$scope.topicChannel = $scope.currentChannel.topic;
							$scope.currentChannel.messages.push("You talk with " + paramUser);
							$scope.currentChannel.listU.push(paramUser);
							$scope.currentChannel.listU.push(nick);
							$scope.channels.push($scope.currentChannel);
						}
						socket.emit("message","PRIVMSG " + paramUser + " :" + paramMess);
						$scope.currentChannel.messages.push(nick + " : " + paramMess);
					}
					else {
						$scope.currentChannel.messages.push("unknown nickname");
					}
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
						socket.emit("message","NAMES");
						boolNames = true;
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
							$scope.currentChannel.messages.push("You have to join a channel");
						}
						break;
					case "/whois":
						if($scope.currentChannel.status === 1) {
							socket.emit("message","WHOIS " + $scope.currentChannel.chan);
						}
						else {
							$scope.currentChannel.messages.push("You should put a user after your command");
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
            socket.emit("message","PRIVMSG " + $scope.currentChannel.chan + " : " + $scope.newMessage);
            $scope.currentChannel.messages.push(nick + ": " + $scope.newMessage);
			$scope.newMessage = undefined;
        }
		else {
			$scope.currentChannel.messages.push("Command invalid");
			$scope.newMessage = undefined;
		}
		$scope.$apply();
    }

    socket.on("message",function(msg) {
		
        if(msg.match(/^[:][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]PRIVMSG[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+[ ][:][ ][a-zA-Z0-9 \W]+$/)) {
            var msgChan = in_isMsg(msg);
            var tt = msgChan[0] + " : " + msgChan[2];
			if($scope.currentChannel.chan !== msgChan[1]) {
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === msgChan[1]) {
						$scope.channels[i].messages.push(tt);
						if($scope.channels[i].notif !== 2) {
							$scope.channels[i].setNotifOn();
						}
					}
				}
			}
			else {
				$scope.currentChannel.messages.push(tt);
			}
			
        }
		else if(msg.match(/^[:][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]PRIVMSG[ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ][:][a-zA-Z0-9 \W]+$/)) {
			var bool = false;
			var msgPriv = in_isMsg(msg);
			var WhispToAdd = new Whisper(msgPriv[0]);
			
			// update
			if($scope.currentChannel.chan !== "@accueil") {
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === $scope.currentChannel.chan) {
						$scope.channels[i] = $scope.currentChannel;
					}
				}
			}
			
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === msgPriv[0]) {
					bool = true;
					var count = i;
				}
			}
			if(bool === false) {
				WhispToAdd.messages.push(msgPriv[0] + " talks to you");
				WhispToAdd.setTopic(msgPriv[0]);
				WhispToAdd.messages.push(msgPriv[0] + " : " + msgPriv[2]);
				WhispToAdd.listU.push(msgPriv[1]);
				WhispToAdd.listU.push(msgPriv[0]);
				WhispToAdd.setNotifOn();
				$scope.channels.push(WhispToAdd);
				
			} 
			else if (bool === true) {
				if($scope.currentChannel.chan === msgPriv[0]) {
					$scope.currentChannel.messages.push(msgPriv[0] + " : " + msgPriv[2]);
				}
				else {
					$scope.channels[count].messages.push(msgPriv[0] + " : " + msgPriv[2]);
					if($scope.channels[count].notif !== 2) {
						$scope.channels[count].setNotifOn();
					}
				}
			}
		}
        else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]NICK[ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+$/)) {
            var msgToPush = in_isNickname(msg);
            var oldname = msgToPush[0];
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === oldname) {
					$scope.channels[i].setChan(msgToPush[1]);
				}
			}
			if($scope.currentChannel.chan === oldname) {
				$scope.currentChannel.setChan(msgToPush[1]);
			}
			if(countNick === 0 ) {
				nick = msgToPush[1];
				if($scope.currentChannel.chan === "@accueil") {
					$scope.currentChannel.messages.push("You have changed his nick to " + nick);
				}
				countNick = 1;
			}
			if(nick === oldname) {
				nick = msgToPush[1];
				if($scope.currentChannel.chan === "@accueil") {
					$scope.currentChannel.messages.push("You have changed his nick to " + nick);
				}
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].listU.includes(oldname) === true) {
						$scope.channels[i].listU[$scope.channels[i].listU.indexOf(oldname)] = nick;
						$scope.channels[i].messages.push(oldname + " has changed his nick to " + nick);
						if(($scope.channels[i].chan !== $scope.currentChannel.chan) && ($scope.channels[i].notif !== 2)) {
							$scope.channels[i].setNotifOn();
						}
					}
				}
			}
			else {
				var newNick = msgToPush[1];
				if($scope.currentChannel.listU.includes(oldname) === true) {
					$scope.currentChannel.listU[$scope.currentChannel.listU.indexOf(oldname)] = newNick;
					$scope.currentChannel.messages.push(oldname + " has changed his nick to " + newNick);
				}
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].listU.includes(oldname) === true) {
						$scope.channels[i].listU[$scope.channels[i].listU.indexOf(oldname)] = newNick;
						$scope.channels[i].messages.push(oldname + " has changed his nick to " + newNick);
						if(($scope.channels[i].chan !== $scope.currentChannel.chan) && ($scope.channels[i].notif !== 2)) {
							$scope.channels[i].setNotifOn();
						}
					}
				}
			}
           
        }
        else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]JOIN[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+$/)) {
			var bool = false;
			boolNames = false;
            var chann = in_isChannel(msg);
			var chanToAdd = new Channel(chann[1]);
			// update
			if($scope.currentChannel.chan !== "@accueil") {
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === $scope.currentChannel.chan) {
						$scope.channels[i] = $scope.currentChannel;
					}
				}
			}
			
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === chann[1]) {
					bool = true;
					var count = i;
				}
			}
			
			if(bool === false) {
				$scope.currentChannel = chanToAdd;
				$scope.currentChannel.messages.push(chann[0] + " has joined the channel " + chann[1]);
				$scope.currentChannel.listU.push(chann[0]);
				$scope.channels.push($scope.currentChannel);
			}
			else if(bool === true) {
				if(nick !== chann[0]) {
					if($scope.currentChannel.chan !== chann[1]) {
						$scope.channels[count].messages.push(chann[0] + " has joined the channel " + chann[1]);
						if($scope.channels[count].notif !== 2){
							$scope.channels[count].setNotifOn();
						}
						$scope.channels[count].listU.push(chann[0]);
					}
					else {
						$scope.currentChannel.messages.push(chann[0] + " has joined the channel " + chann[1]);
						$scope.currentChannel.listU.push(chann[0]);
					}
				}
			}
			
        }
		else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]PART[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+[ ][:][\w\W ]+$/)) {
			var chann = in_isChannel(msg);
			if(nick === chann[0]) {
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
								$scope.currentChannel.messages.push("You leave the channel " + chann[1] + " and you join the channel " + $scope.channels[$scope.channels.length-1].chan);
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
				$scope.currentChannel.removeUser(chann[0]);
				$scope.currentChannel.messages.push(chann[0] + " leave the channel " + chann[1]);
			}
			else {
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === chann[1]) {
						$scope.channels[i].removeUser(chann[0]);
						$scope.channels[i].messages.push(chann[0] + " leave the channel");
						if($scope.channels[i].notif !== 2) {
							$scope.channels[i].setNotifOn();
						}
						
					}
				}
			}
			
		}
		else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]QUIT[ ][:][Gone]$/)) {
			//quit
			alert("dans quit");
		}
		else if(msg.includes("PING")===true) {
			socket.emit("message", "PONG");
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][5][3][ ][a-zA-Z]+[ ][=][ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+[ ][:][@a-zA-Z0-9 ]+$/)) {
			var isNames = in_isNames(msg);
			var us = isNames[1];
			var mNames = "";
			for(var i = 0; i<us.length; i++) {
				mNames = us[i] + ", " + mNames;
			}
			if(boolNames === false) {
				for(var i = 0;i<us.length; i++) {
					if(($scope.currentChannel.listU.includes(us[i]))===false) {
						$scope.currentChannel.listU.push(us[i]);
					}
				}	
			}
			else if(boolNames === true){
				var channelName = isNames[0];
				mNames = "User(s) in the channel " + channelName + " : " + mNames;
				$scope.currentChannel.messages.push(mNames);
			}
			boolNames = true;
			
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][2][2][1][ ][\w\W]+[ ][\w\W]+$/)) {
			var welcome = (/^:[0-9.a-z:]+[ ][2][2][1][ ]([\w\W]+)[ ][\w\W]+$/).exec(msg);
			var nick = welcome[1];
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][7][2][ ][:][-][ ][a-zA-Z]+[ ][\w\W]+$/)) {
			var welcome = (/^:[0-9.a-z:]+[ ][3][7][2][ ][:][-][ ][a-zA-Z]+[ ]([\w\W]+)$/).exec(msg);
			var nick = welcome[1];
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][3][1][ ][a-zA-Z]+[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+[ ][:][a-zA-Z0-9 ,?;.\/!§ù%*µ$£^=+)@àç_è\-('"é&²]+$/)) {
			var topic = in_isTopic(msg);
			
			$scope.currentChannel.setTopic(topic[0] + " :" + topic[1]);
			$scope.topicChannel = $scope.currentChannel.topic;
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][3][2][ ][a-zA-Z]+[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+[ ][:][a-zA-Z0-9 ,?;.\/!§ù%*µ$£^=+)@àç_è\-('"é&²]+$/)) {
			var command = (/^:[0-9.a-z:]+[ ][3][3][2][ ]TOPIC[ ]([#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+)[ ][:]([a-zA-Z0-9 ,?;.\/!§ù%*µ$£^=+)@àç_è\-('"é&²]+)$/).exec(msg);
			var commandChannel = command[1];
			var commandMsg = command[2];
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === commandChannel) {
					if($scope.currentChannel.chan === commandChannel) {
						$scope.channels[i].setTopic = commandMsg;
					}
					else {
						
					}
				}
			}
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][2][2][ ][a-z]+[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?%£*\-*\/+]+[ ][0-9]+[ ][:][\w\W ]+$/)) {
			var list = in_isList(msg);
			$scope.currentChannel.messages.push("Channel : " + list[0] + " with " + list[1] + " user(s) - Topic ->" + list[2]);
		}
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][7][2][ ][:][-][ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+$/)) { 
            $scope.currentChannel.messages.push("Welcome " + realN);
        }
		else if(msg.match(/^:[0-9.a-z:]+[ ][3][1][1][ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+[ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+[ ][0-9.]+[ ][*][ ][:][ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+$/)) {
			var regXpTab = (/^:[0-9.]+[ ][3][1][1][ ]([a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+)[ ]([a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+)[ ][0-9.]+[ ][*][ ][:][ ]([a-zA-Z0-9_\-é"'ëäïöüâêîôûç `è]+)$/).exec(msg);
			if(regXpTab[2].includes("GUEST")===true) {
				$scope.currentChannel.messages.push("Nickname : " + regXpTab[1] + " is a Guest");
			}
			else {
				$scope.currentChannel.messages.push("Nickname : " + regXpTab[1] + " and his ID is " + regXpTab[2] + " - Realname : " + regXpTab[3]);
			}
			
		}
		else if(msg.includes("352")===true) {
			$scope.currentChannel.messages.push(msg);
		}
        else if(msg.includes("431")===true) {
            $scope.currentChannel.messages.push("No nickname given");
        }
        else if(msg.includes("433")===true) {
            $scope.currentChannel.messages.push("Nickname already use");
        }
        else if(msg.includes("403")===true) {
            $scope.currentChannel.messages.push("No such channel");
        }
        else if(msg.includes("404")===true) {
            $scope.currentChannel.messages.push("Cannot send to channel");
        }
        else if(msg.includes("411")===true) {
            $scope.currentChannel.messages.push("No recipient give");
        }
        else if(msg.includes("412")===true) {
            $scope.currentChannel.messages.push("No text to send");
        }
        else if(msg.includes("421")===true) {
            $scope.currentChannel.messages.push("Unknown command");
        }
        else if(msg.includes("451")===true) {
            $scope.currentChannel.messages.push("You have not registered");
        }
        else if(msg.includes("442")===true) {
            $scope.currentChannel.messages.push("You are not on that channel");
        }
        else if(msg.includes("461")===true) {
            $scope.currentChannel.messages.push("Not enough parameters");
        }
        else if(msg.includes("471")===true) {
            $scope.currentChannel.messages.push("Channel is full");
        }
        else if(msg.includes("462")===true) {
            $scope.currentChannel.messages.push("Already registered");
        }
        else if(msg.includes("473")===true) {
            $scope.currentChannel.messages.push("Connot join the invitation");
        }
        else if(msg.includes("474")===true) {
            $scope.currentChannel.messages.push("You're banned from this channel");
        }
        else if(msg.includes("475")===true) {
            $scope.currentChannel.messages.push("You're banned from this channel");
        }
        // response
        else if(msg.includes("475")===true) {
            $scope.currentChannel.messages.push("You're banned from this channel");
        }
		$scope.currentChannel.messages.push(msg);
		
		$scope.$apply();
    });


});
