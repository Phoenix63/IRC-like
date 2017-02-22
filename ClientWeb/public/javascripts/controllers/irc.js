myApp.controller("ircCtrl",function($scope) {
    var user = new User();
    var nick = user.nick;
    var realN = user.realName;
	var boolNames = undefined;
	var boolNoNames = false;
    socket.emit("message","USER Gilo243 0 * : " + realN);
	$scope.currentChannel = new Channel("@accueil");
    $scope.channels = [];
	
	
	$scope.joinChannel = function(ch) {
		$scope.currentChannel = ch;
	}
	
    $scope.sendMessage = function() {
        var cmd = $scope.newMessage.match(/^\/[a-z]+[ ][\w#&é"'(\-è_çà)=$*ù^!?.\/]+/g);
		var cmd1 = $scope.newMessage.match(/^\/[a-z]+$/);
        if(cmd!=null) {
			var command = $scope.newMessage.split(' ');
            var string = command[1];
            switch(command[0]) {
                case "/join":
                    socket.emit("message", "JOIN " + string);
					if($scope.currentChannel.chan !== "@accueil") {
						for(var i = 0;i<$scope.channels.length; i++) {
							if(string === $scope.channels[i].chan) {
								$scope.currentChannel = $scope.channels[i];
							}
						}
					}
                    $scope.newMessage = undefined;
                    break;
                case "/nick":
                    socket.emit("message", "NICK " + string);
                    $scope.newMessage = undefined;
                    break;
                case "/part":
                    //leave the channel
					if($scope.currentChannel.status === 0) {
						socket.emit("message","PART " + string);
					}
					else {
						if($scope.channels.length !== 1) {
							if($scope.currentChannel.chan !==string) {
								for(var i = 0; i<$scope.channels.length; i++) {
									if($scope.channels[i].chan === string) {
										$scope.channels.splice(i,1);
									}
								}
							}
							else {
								for(var i = 0; i<$scope.channels.length; i++) {
									if($scope.channels[i].chan === string) {
										$scope.channels.splice(i,1);
										$scope.currentChannel = $scope.channels[$scope.channels.length-1];
									}
								}
							}
						}
						else {
							$scope.channels.splice(0,1);
							$scope.currentChannel = new Channel("@accueil");
						}
						
					}

					$scope.newMessage = undefined;
                    break;
                case "/who":
                    //users in the current channel
					socket.emit("message","WHO " + string);
					$scope.newMessage = undefined;
                    break;
                case "/msg":
                    //messages
					if(command[2] === undefined) {
						$scope.currentChannel.messages.push("You should write a message");
					}
					else {
						var booleUnkownNick = false;
						var booleUsedWhisp = false;
						for(var i = 0; i<$scope.channels.length; i++) {
							if($scope.channels[i].listU.includes(string) === true) {
								booleUnkownNick = true;
							}
							if($scope.channels[i].chan === string) {
								booleUsedWhisp = true;
								var counter = i;
							}
						}
						// update
						if(booleUnkownNick === true) {
							if($scope.currentChannel.chan !== "@accueil") {
								for(var i = 0; i<$scope.channels.length; i++) {
									if($scope.channels[i].chan === $scope.currentChannel.chan) {
										$scope.channels[i] = $scope.currentChannel;									}
								}
							}
							if(booleUsedWhisp === true) {
								$scope.currentChannel = $scope.channels[counter];
							}
							else {
								$scope.currentChannel = new Whisper(string);
								$scope.currentChannel.messages.push("You talk with " + string);
								$scope.currentChannel.listU.push(string);
								$scope.currentChannel.listU.push(nick);
								$scope.channels.push($scope.currentChannel);
							}
							var messToSend = out_isMsg($scope.newMessage);
							socket.emit("message","PRIVMSG " + string + " :" + messToSend);
							$scope.currentChannel.messages.push(nick + " : " + messToSend);
						}
						else {
							$scope.currentChannel.messages.push("unknown nickname");
						}
						
					}
					
                    $scope.newMessage = undefined;
                    break;
                default:
					$scope.newMessage = undefined;
                    $scope.currentChannel.messages.push("not a command");
            }
        }
		else if(cmd1!=null) {
			switch(cmd1[0]) {
				case "/part":
					if($scope.currentChannel.chan !== "@accueil") {
						if($scope.currentChannel.status === 0) {
							socket.emit("message","PART " + $scope.currentChannel.chan);
						}
						else {
							if($scope.channels.length === 1) {
								$scope.channels.splice(0,1);
								$scope.currentChannel = new Channel("@accueil");
							}
							else {
								for(var i = 0; i<$scope.channels.length; i++) {
									if($scope.channels[i].chan === $scope.currentChannel.chan) {
										$scope.channels.splice(i,1);
										$scope.currentChannel = $scope.channels[$scope.channels.length-1];
									}
								}
							}		
						}
					}
					$scope.newMessage = undefined;
					break;
				case "/names":
					//users on every channel
                    socket.emit("message","NAMES");
					boolNames = true;
                    $scope.newMessage = undefined;
					break;
				case "/list":
					//list every channels with their topic
                    socket.emit("message","LIST");
                    $scope.newMessage = undefined;
					break;
				case "/who":
					if($scope.currentChannel.chan !== "@accueil") {
						socket.emit("message","WHO " + $scope.currentChannel.chan);
					}
					else {
						$scope.currentChannel.messages.push("You have to join a channel");
					}
					$scope.newMessage = undefined;
					break;
				case "/quit":
					//leave the server
                    socket.emit("message","QUIT");
                    $scope.newMessage = undefined;
					break;
				default:
			}
			
		}
        else if($scope.currentChannel.chan !== "@accueil"){
            socket.emit("message","PRIVMSG " + $scope.currentChannel.chan + " : " + $scope.newMessage);
            $scope.currentChannel.messages.push(nick + ": " + $scope.newMessage);
            $scope.newMessage = undefined;
        }
		else {
			$scope.currentChannel.messages.push("You should join a channel");
			$scope.newMessage = undefined;
		}
		$scope.$apply();
    }

    socket.on("message",function(msg) {
		
        if(msg.match(/^[:][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]PRIVMSG[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?,%£*\-*\/+]+[ ][:][ ][a-zA-Z0-9 \W]+$/)) {
            var msgChan = in_isMsg(msg);
            var tt = msgChan[0] + " : " + msgChan[2];
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === msgChan[1]) {
					$scope.channels[i].messages.push(tt);
				}
			}
        }
		else if(msg.match(/^[:][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]PRIVMSG[ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ][:][ ][a-zA-Z0-9 \W]+$/)) {
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
				$scope.currentChannel = WhispToAdd;
				$scope.currentChannel.messages.push(msgPriv[0] + " : " + msgPriv[2]);
				$scope.channels.push($scope.currentChannel);
			} 
			else if (bool === true) {
				$scope.channels[count].messages.push(msgPriv[0] + " : " + msgPriv[2]);
				$scope.currentChannel = $scope.channels[count];
			}
			if($scope.currentChannel.listU.includes(msgPriv[1]) === false) {
				$scope.currentChannel.listU.push(msgPriv[1]);
				$scope.currentChannel.listU.push(msgPriv[0]);
			}
		}
        else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]NICK[ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+$/)) {
            var msgToPush = in_isNickname(msg);
            var oldname = msgToPush[0];
            nick = msgToPush[1];
			if($scope.currentChannel.chan === "@accueil") {
				$scope.currentChannel.messages.push(oldname + " has changed his nick to " + nick);
			}
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].listU.includes(oldname) === true) {
					$scope.channels[i].listU[$scope.channels[i].listU.indexOf(oldname)] = nick;
					$scope.channels[i].messages.push(oldname + " has changed his nick to " + nick);
				}
			}
        }
        else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]JOIN[ ][#][\w#&é"'\(è_çà@€^$:!ù;¨?,%£*\-*\/+]+$/)) {
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
				$scope.channels.push($scope.currentChannel);
			}
			else if(bool === true) {
				$scope.channels[count].messages.push(chann[0] + " has joined the channel " + chann[1]);
				$scope.currentChannel = $scope.channels[count];
			}
			
			if($scope.currentChannel.listU.includes(chann[0]) === false) {
				$scope.currentChannel.addUser(chann[0]);
			}
        }
		else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]PART[ ][#][\w#&é"'\(è_çà@€^$*\-*\/+]+$/)) {
			var chann = in_isChannel(msg);
			if(nick === chann[0]) {
				if($scope.channels.length === 1) {
				$scope.channels.splice(0,1);
				$scope.currentChannel = new Channel("@accueil");
				$scope.currentChannel.messages.push("You leave the channel " + chann[1]);
				}
				else {
					for(var i = 0; i<$scope.channels.length; i++) {
						if($scope.channels[i].chan === chann[1]) {
							if($scope.currentChannel === $scope.channels[i]) {
								$scope.channels.splice(i,1);
								$scope.currentChannel = $scope.channels[$scope.channels.length-1];
								$scope.currentChannel.messages.push("You leave the channel " + chann[1] + " and you join the channel " + $scope.channels[$scope.channels.length-1].chan);
							}
							else {
								$scope.channels.splice(i,1);
								$scope.currentChannel.messages.push("You leave the channel " + chann[1]);
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
		else if(msg.includes("353")===true) {
			boolNoNames = true;
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
			
		}
		else if(msg.includes("366")===true) {
			if(boolNoNames !== true) {
				$scope.currentChannel.messages.push("There are no users in channels");
			}
			boolNoNames = false;
		}
		/*else if(msg.includes("315")===true) {
			if(boolNoList !== true) {
				$scope.currentChannel.messages.push("There are no users in this channels");
			}
			boolNoList = false;
		}*/
		else if(msg.includes("352")===true) {
			$scope.currentChannel.messages.push(msg);
		}
        else if((msg.includes("372")===true)) {
            $scope.currentChannel.messages.push("Welcome " + realN);
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
		$scope.$apply();
    });


});

