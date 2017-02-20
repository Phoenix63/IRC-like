myApp.controller("ircCtrl",function($scope) {

    var user = new User();
    var nick = user.userN;
    var realN = user.realName;
    socket.emit("message","USER Gilo53 0 * : " + realN);
	$scope.currentChannel = new Channel("accueil");
    $scope.channels = [];
	
    $scope.sendMessage = function() {
        var cmd = $scope.newMessage.match(/^\/[a-z]+[ ]/g);
        if(cmd!=null) {
            var string = $scope.newMessage.split(cmd)[1];
            switch(cmd[0]) {
                case "/join ":
                    socket.emit("message", "JOIN " + string);
					if($scope.currentChannel.chan !== "accueil") {
						for(var i = 0;i<$scope.channels.length; i++) {
							if(string === $scope.channels[i].chan) {
								$scope.currentChannel = $scope.channels[i];
							}
						}
					}
                    $scope.newMessage = undefined;
                    break;
                case "/nick ":
                    socket.emit("message", "NICK " + string);
                    $scope.newMessage = undefined;
                    break;
                case "/names":
                    //users on every channel
                    socket.emit("message","NAMES");
                    $scope.newMessage = undefined;
                    break;
                case "/list":
                    //list every channels with their topic
                    socket.emit("message","LIST");
                    $scope.newMessage = undefined;
                    break;
                case "/part ":
                    //leave the channel
                    socket.emit("message","PART " + string);
                    $scope.newMessage = undefined;
                    break;
                case "/quit":
                    //leave the server
                    socket.emit("message","QUIT");
                    $scope.newMessage = undefined;
                    break;
                case "/who ":
                    //users in the current channel
                    socket.emit("message","WHO " + string);
                    $scope.newMessage = undefined;
                    break;
                case "/msg ":
                    //messages
                    socket.emit("message","PRIVMSG " + currentChannel.chan + " : " + $scope.newMessage);
                    $scope.currentChannel.messages.push(nick + ": " + $scope.newMessage);
                    $scope.newMessage = undefined;
                    break;
                default:
					$scope.newMessage = undefined;
                    $scope.currentChannel.messages.push("not a command");
            }
        }
        else {
            socket.emit("message","PRIVMSG " + $scope.currentChannel.chan + " : " + $scope.newMessage);
            $scope.currentChannel.messages.push(nick + ": " + $scope.newMessage);
            $scope.newMessage = undefined;
        }
		$scope.$apply();
    }

    socket.on("message",function(msg) {
        if(msg.match(/^[:][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]PRIVMSG[ ][#]?[\w#&é"'\(è_çà@€^$*\-*\/+]+[ ][:][ ][a-zA-Z0-9 \W]+$/)) {
            var msgPriv = in_isMsg(msg);
            var tt = msgPriv[0] + " : " + msgPriv[2];
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].chan === msgPriv[1]) {
					$scope.channels[i].messages.push(tt);
				}
			}
        }
        else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]NICK[ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+$/)) {
            var msgToPush = in_isNickname(msg);
            var oldname = msgToPush[0];
            nick = msgToPush[1];
			if($scope.currentChannel.chan === "accueil") {
				$scope.currentChannel.messages.push(oldname + " has changed his nick to " + nick);
			}
			for(var i = 0; i<$scope.channels.length; i++) {
				if($scope.channels[i].listU.includes(oldname) === true) {
					$scope.channels[i].listU[$scope.channels[i].listU.indexOf(oldname)] = nick;
					$scope.channels[i].messages.push(oldname + " has changed his nick to " + nick);
				}
			}
        }
        else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]JOIN[ ][#][\w#&é"'\(è_çà@€^$*\-*\/+]+$/)) {
			var bool = false;
            var chann = in_isChannel(msg);
			var chanToAdd = new Channel(chann[1]);
			
			if($scope.currentChannel.chan !== "accueil") {
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
				$scope.channels.push($scope.currentChannel);
			}
			else if(bool === true) {
				$scope.currentChannel = $scope.channels[count];
			}
			
			if($scope.currentChannel.listU.includes(chann[0]) === false) {
				$scope.currentChannel.addUser(chann[0]);
			}
            $scope.currentChannel.messages.push(chann[0] + " has joined the channel");
        }
		else if(msg.includes("PING")===true) {
			socket.emit("message", "PONG");
		}
		else if(msg.includes("353")===true) {
			var us = in_isNames(msg);
			var mNames = "";
			for(var i=0; i<us.length; i++) {
				if(($scope.currentChannel.listU.includes(us[i]))===false) {
					$scope.currentChannel.listU.push(us[i]);
				}
				mNames = us[i] + ", " + mNames;
			}
			mNames = mNames + " is on the channel " + currentChannel.chan;
			
			$scope.currentChannel.messages.push(mNames);
		}
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

