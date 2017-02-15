myApp.controller("ircCtrl",function($scope) {

<<<<<<< HEAD
        var user = new User();
		var nick = user.userN;
		var realN = user.realName;
		socket.emit("message","USER Gilooo 0 * : " + realN);	
		$scope.messages = [];
		$scope.users = [];
		$scope.channels = [];
		var currentChannel = "";
		var channelList = [];
		
		$scope.sendMessage = function() {
		
			var cmd = $scope.newMessage.match(/^\/[a-z]+/g);
			if(cmd!=null) {
				var string = $scope.newMessage.split(cmd)[1];
				switch(cmd[0]) {
					case "/join":
						socket.emit("message", "JOIN" + string);
						$scope.newMessage = undefined;
						break;
					case "/nick":
						socket.emit("message", "NICK" + string);
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
					case "/part":
						//leave the channel
						socket.emit("message","PART" +string);
						$scope.newMessage = undefined;
						break;
					case "/quit":
						//leave the server
						socket.emit("message","QUIT");
						$scope.newMessage = undefined;
						break;
					case "/who":
						//users in the current channel
						socket.emit("message","WHO" + string);
						$scope.newMessage = undefined;
						break;
					case "/msg":
						//messages
						socket.emit("message","PRIVMSG" + currentChannel + " : " + $scope.newMessage);
						$scope.messages.push(nick + ": " + $scope.newMessage);
						$scope.newMessage = undefined;
						$scope.$apply();
						break;
					default:
						alert("noob");
				}
			}
			else {
				alert(currentChannel);
				socket.emit("message","PRIVMSG " + currentChannel + " : " + $scope.newMessage);
				$scope.messages.push(nick + ": " + $scope.newMessage);
				$scope.newMessage = undefined;
				$scope.$apply();
			}
		}
			
		socket.on("message",function(msg) {				
				if(msg.match(/^[:][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]PRIVMSG[ ][#]?[a-zA-Z0-9]+[ ][:][ ][a-zA-Z0-9 ]+$/)) {
					var msgPriv = in_isMsg(msg);
					var tt = msgPriv[0] + " : " + msgPriv[2];
					$scope.messages.push(tt);
					$scope.$apply();
				}
				else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]NICK[ ][a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+$/)) {
					var msgToPush = in_isNickname(msg);
					var oldname = msgToPush[0];
					nick = msgToPush[1];
					$scope.users[$scope.users.indexOf(oldname)] = nick;
					$scope.messages.push(msgToPush[0] + " has changes his nick to " + msgToPush[1]);
					$scope.$apply();
				}
				else if(msg.match(/^:[a-zA-Z0-9_\-é"'ëäïöüâêîôûç`è]+[ ]JOIN[ ][#][a-zA-Z0-9]+$/)) {
					var chann = in_isChannel(msg);
					if($scope.channels.includes(chann[1])===false) {
						$scope.channels.push(chann[1]);
						//channelList.push(new Channel(chann,));
					}
					if($scope.users.includes(chann[0])===false) {
						$scope.users.push(chann[0]);
					}
					currentChannel = chann[1];
					$scope.messages.push("You have join the channel " + currentChannel);
					$scope.$apply();
					
				}
				else if(msg.includes("353")===true) {
					var l = in_isNames(msg);
					$scope.$apply();
					for (var i=0; i<l.length; i++) {
						if($scope.users.includes(l[i])===false) {
							$scope.users.push(l[i]);
							$scope.$apply();
						}
					}
				}
				else if((msg.includes("372")===true)) {
					$scope.messages.push("Welcome " + realN);
					$scope.$apply();
				}
				else if(msg.includes("431")===true) {
					$scope.messages.push("No nickname given");
					$scope.$apply();
				}
				else if(msg.includes("433")===true) {
					$scope.messages.push("Nickname already use");
					$scope.$apply();
				}
				else if(msg.includes("403")===true) {
					$scope.messages.push("No such channel");
					$scope.$apply();
				}
				else if(msg.includes("404")===true) {
					$scope.messages.push("Cannot send to channel");
					$scope.$apply();
				}
				else if(msg.includes("411")===true) {
					$scope.messages.push("No recipient give");
					$scope.$apply();
				}
				else if(msg.includes("412")===true) {
					$scope.messages.push("No text to send");
					$scope.$apply();
				}
				else if(msg.includes("421")===true) {
					$scope.messages.push("Unknown command");
					$scope.$apply();
				}
				else if(msg.includes("451")===true) {
					$scope.messages.push("You have not registered");
					$scope.$apply();
				}
				else if(msg.includes("442")===true) {
					$scope.messages.push("You are not on that channel");
					$scope.$apply();
				}
				else if(msg.includes("461")===true) {
					$scope.messages.push("Not enough parameters");
					$scope.$apply();
				}
				else if(msg.includes("471")===true) {
					$scope.messages.push("Channel is full");
					$scope.$apply();
				}
				else if(msg.includes("462")===true) {
					$scope.messages.push("Already registered");
					$scope.$apply();
				}
				else if(msg.includes("473")===true) {
					$scope.messages.push("Connot join the invitation");
					$scope.$apply();
				}
				else if(msg.includes("474")===true) {
					$scope.messages.push("You're banned from this channel");
					$scope.$apply();
				}
				else if(msg.includes("475")===true) {
					$scope.messages.push("You're banned from this channel");
					$scope.$apply();
				}
				// response
				else if(msg.includes("475")===true) {
					$scope.messages.push("You're banned from this channel");
					$scope.$apply();
				}		
			});
=======
    var user = new User();
    var nick = user.userN;
    var realN = user.realName;
    $scope.messages = [];
    $scope.users = [];
    $scope.channels = [];
    currentChannel = "";

    $scope.sendMessage = function() {

        var cmd = $scope.newMessage.match(/^\/[a-z]+/g);
        if(cmd!=null) {
            var string = $scope.newMessage.split(cmd)[1];
            switch(cmd[0]) {
                case "/join":
                    socket.emit("message", "JOIN" + string);
                    $scope.messages.push("You have join channel : " + string);
                    $scope.channels.push(string);
                    currentChannel = string;
                    $scope.$apply();
                    break;
                case "/nick":
                    socket.emit("message", "NICK" + string);
                    socket.emit("message","USER" + string + " 0 * :" + string);
                    break;
                case "/names":
                    //users on every channel
                    socket.emit("message","NAMES");
                    break;
                case "/list":
                    //list every channels with their topic
                    socket.emit("message","LIST");
                    break;
                case "/part":
                    //leave the channel
                    socket.emit("message","PART" +string);
                    break;
                case "/quit":
                    //leave the server
                    socket.emit("message","QUIT");
                    break;
                case "/who":
                    //users in the channel
                    socket.emit("message","WHO" + string);
                    break;
                case "/msg":
                    //messages
                    socket.emit("message","PRIVMSG" + currentChannel + " : " + $scope.newMessage);
                    $scope.messages.push(nick + ": " + $scope.newMessage);
                    $scope.$apply();
                    break;
                default:
            }

            $scope.newMessage = undefined;
        }
    }

    socket.on("message",function(msg) {
        //error message && response message
        if(msg.match(/^[:][a-zA-Z0-9]+[ ]PRIVMSG[ ][#]?[a-zA-Z0-9]+[ ][:][ ][a-zA-Z0-9 ]+$/)) {
            var nck = msg.match(/^:[a-zA-Z0-9]+/g)[0];
            nck.replace(":","");
            var command = msg.match(/^[:][a-zA-Z0-9]+[ ]PRIVMSG[ ][#]?[a-zA-Z0-9]+[ ][:][ ]/g);
            var m = msg.split(command)[1];
            $scope.messages.push(nck + " : " + m);
            $scope.$apply();
        }
        else if(msg.includes("331")===true) {
            $scope.messages.push("You have join the channel");
            $scope.$apply();
        }
        else if((msg.includes("NOTICE AUTH")===true)&&(msg.includes("Looking up")===true)) {
            $scope.messages.push("You have join the server");
            $scope.$apply();
        }
        else if(msg.includes("431")===true) {
            $scope.messages.push("No nickname given");
            $scope.$apply();
        }
        else if(msg.includes("433")===true) {
            $scope.messages.push("Nickname already use");
            $scope.$apply();
        }
        else if(msg.includes("403")===true) {
            $scope.messages.push("No such channel");
            $scope.$apply();
        }
        else if(msg.includes("404")===true) {
            $scope.messages.push("Cannot send to channel");
            $scope.$apply();
        }
        else if(msg.includes("411")===true) {
            $scope.messages.push("No recipient give");
            $scope.$apply();
        }
        else if(msg.includes("412")===true) {
            $scope.messages.push("No text to send");
            $scope.$apply();
        }
        else if(msg.includes("421")===true) {
            $scope.messages.push("Unknown command");
            $scope.$apply();
        }
        else if(msg.includes("451")===true) {
            $scope.messages.push("You have not registered");
            $scope.$apply();
        }
        else if(msg.includes("442")===true) {
            $scope.messages.push("You are not on that channel");
            $scope.$apply();
        }
        else if(msg.includes("461")===true) {
            $scope.messages.push("Not enough parameters");
            $scope.$apply();
        }
        else if(msg.includes("471")===true) {
            $scope.messages.push("Channel is full");
            $scope.$apply();
        }
        else if(msg.includes("462")===true) {
            $scope.messages.push("Already registered");
            $scope.$apply();
        }
        else if(msg.includes("473")===true) {
            $scope.messages.push("Connot join the invitation");
            $scope.$apply();
        }
        else if(msg.includes("474")===true) {
            $scope.messages.push("You're banned from this channel");
            $scope.$apply();
        }
        else if(msg.includes("475")===true) {
            $scope.messages.push("You're banned from this channel");
            $scope.$apply();
        }
        // response
        else if(msg.includes("475")===true) {
            $scope.messages.push("You're banned from this channel");
            $scope.$apply();
        }
>>>>>>> origin/express
    });
});

