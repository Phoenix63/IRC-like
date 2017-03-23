myApp.controller("ircCtrl",function($scope, $location, $sce, $window, userInfo) {
	var user = userInfo;
	user.setRight(2);
	var defaultMess = new User("#Channel-Response");
	var errorResponse = new User("#Error-Response");
	errorResponse.setRight(2);
	defaultMess.setRight(2);
	var host = $window.location.host;
	var landingUrl = "http://" + host;
	var connect = undefined;
	var boolNames = undefined;
	var boolAskTopic = undefined;
	var isCmdMute = false;
	var boolFalse = true;
	var boolList = false;
	var boolWho = false;
	var boolOnlyOneUser = false;
	var countNick = 0;
	var admin = [];
	var userInvisible = "";
	$scope.currentChannel = new Channel("@home");
	$scope.channels = [];
	$scope.topicChannel = "PANDIRC";
	$scope.$connected = true;
	var userFile = new User("");
	userFile.setRight(5);
	userInfo.socket.emit("message", "LIST");
	$scope.newLogInNick = function() {
		userInfo.setNick($scope.newNick);
		userInfo.socket.emit("message", "NICK " + userInfo.nick);
		$("#dialog").fadeOut();
		$("#masque").fadeOut();
	}
	
	$scope.uploadImage = function(fich) {
		userInfo.connectFile();
		boolFile = true;
		if(fich.length > 1) {
			bootbox.alert("You must put one file");
		}
		else if(fich[0].size >= 2097152) {
			bootbox.alert("File too big");
		}
		else if($scope.currentChannel.chan === "@home") {
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),  "You should be in a channel"]);
		}
		else {
			var nameF = fich[0].name;
			while (nameF.indexOf(' ') !== -1) {
				nameF = nameF.replace(' ', '_');
			}
			if(isImage(fich[0].name)) {
				var readerPreview = new FileReader();
				readerPreview.onload = function (e) {
					bootbox.prompt("<a href='" + e.target.result + "' target='_blank'><img src='"+ e.target.result +"' class = 'previewImage'></img></a> Do you want to send <strong>" + nameF + "</strong> ?<center><p>Add a message</p></center>", function(ev){
						if(ev !== null) {
							msgToSend = ev;
							var readerSend = new FileReader();
							readerSend.onload = function() {
								var arrayBuffer = readerSend.result;
								array1 = new Uint8Array(arrayBuffer);
								binaryString = String.fromCharCode.apply(null, array1);
								userInfo.filePort.emit("data", "FILE " + binaryString.length + " " + nameF);
								userInfo.filePort.emit("data", array1);
							}
							readerSend.readAsArrayBuffer(fich[0]);
						}
						$scope.$apply();
					});
				}
				readerPreview.readAsDataURL(fich[0]);
			}
			else {
				bootbox.prompt("<img src='../images/fichier.jpg' class = 'previewImage'></img> Do you want to send <strong>" + nameF + "</strong> ?<center><p>Add a message</p></center>", function(ev){
					if(ev !== null) {
						var readerSend = new FileReader();
						msgToSend = ev;
						readerSend.onload = function() {
							var arrayBuffer = readerSend.result;
							array1 = new Uint8Array(arrayBuffer);
							binaryString = String.fromCharCode.apply(null, array1);
							userInfo.filePort.emit("data", "FILE " + binaryString.length + " " + nameF);
							userInfo.filePort.emit("data", array1);
						}
						readerSend.readAsArrayBuffer(fich[0]);
					}
					$scope.$apply();
				});
			}
			userInfo.filePort.on("file", function(msg){
				$("#fileUpload").show();
				if(msg.match(/^[\S]+[ ]FILE[ ]TRANSFERT[ ][\S\W]+/g)){
					var rspTransfert = (/^[\S]+[ ]FILE[ ]TRANSFERT[ ]([\S\W]+)/g).exec(msg);
					var percentString = rspTransfert[1];
					percentString = percentString.replace(":","");
					var number1 = percentString.split("/");
					var n1 = parseInt(number1[0]);
					var n2 = parseInt(number1[1]);
					var percent = Math.ceil((n1/n2)*100);
					$("#progbar").css("width","" + percent + "%");
				}
				else if(msg.match(/^[\S]+[ ]FILE/g)) {
					$("#fileUpload").hide();
					var msgFile = (/^:[\S]+[ ]FILE[ ]([\S]+)/g).exec(msg);
					var fileReceive = in_isFile(msgFile[1]);
					if(isImage(msgFile[1])) {
						var img = new Image();
						img.onload = function() {
							var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
							if(msgToSend === "") {
								$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-user-file' class='user-color'>" + user.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + fileReceive[0] + "' target='_blank'>" + fileReceive[0] + "</a></p><p><a href='" + fileReceive[0] + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + fileReceive[0] + "'/></a></p></div>"]);
							}
							else {
								$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-user-file' class='user-color'>" + user.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + fileReceive[0] + "' target='_blank'>" + fileReceive[0] + "</a></p><p>" + msgToSend + "</p><p><a href='" + fileReceive[0] + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + fileReceive[0] + "'/></a></p></div>"]);
							}
							$scope.$apply();
						}
						img.onerror = function() {
							$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),  "Can't load the image"]);
						}
						img.src = fileReceive[0];
					}
					else {
						if(msgToSend === "") {
							$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-user-file' class='user-color'>" + user.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + fileReceive[0] + "' target='_blank'>" + fileReceive[0] + "</a></p></div>"]);
						}
						else {
							$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-user-file' class='user-color'>" + user.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + fileReceive[0] + "' target='_blank'>" + fileReceive[0] + "</a></p><p>" + msgToSend + "</p><p><a href='" + fileReceive[0] + "' target='_blank'>" + fileReceive[0] + "</a></p></div>"]);
						}
					}
					if($scope.currentChannel.chan !== "@home") {
						if(msgToSend === "") {
							userInfo.socket.emit("message", "PRIVMSG " + $scope.currentChannel.chan + " :" + fileReceive[0]);
						}
						else {
							userInfo.socket.emit("message", "PRIVMSG " + $scope.currentChannel.chan + " :" + fileReceive[0] + " " + msgToSend);
						}
					}
					else {
						$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),  "You should join a channel"]);
					}
				}
				$scope.$apply();
			});
		}
		$scope.$apply();
	};
	
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
		["Leave", function ($itemScope) {
			if(ch.chan.includes("#") === false) {
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === ch.chan) {
						if($scope.currentChannel.chan === ch.chan) {
							$scope.channels.splice(i,1);
							if($scope.channels.length === 0) {
								$scope.currentChannel = new Channel("@home");
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
		['SetTopic', function ($itemScope) {
			bootbox.prompt("Set the topic", function(setTopic){
				if(setTopic !== null) {
					userInfo.socket.emit("message", "TOPIC " +$scope.currentChannel.chan + " " + setTopic);
				}
			});
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
			userInfo.socket.emit("message", "WHOIS " + userL.nick);
		}],
		["Invite", function ($itemScope) {
			bootbox.prompt("In which channel ?", function(ev){
				if(ev !== null) {
					userInfo.socket.emit("message", "INVITE " + userL.nick + " " + ev);
				}
				$scope.$apply();
			});
		}],
		["Mute", function ($itemScope) {
			isCmdMute = true;
			userInfo.socket.emit("message", "WHOIS " + userL.nick);
		}],
		["DeMute", function ($itemScope) {
			user.removeUserMute(userL.nick);
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(),  "You have demute " + userL.nick]);
		}],
		["Kick", function ($itemScope) {
			userInfo.socket.emit("message", "KICK " + $scope.currentChannel.chan + " " + userL.nick);
		}],
		["Bann", function ($itemScope) {
			userInfo.socket.emit("message", "MODE " + $scope.currentChannel.chan + " +b " + userL.nick);
		}]
	];};
	
	$scope.menuOptionsAway = function() {return [
		["Away", function ($itemScope) {
			userInfo.socket.emit("message", "AWAY : Gone");
		}],
		["Unaway", function ($itemScope) {
			userInfo.socket.emit("message", "AWAY");
		}]
	];};
	
	$scope.helpPandirc = function() {
		bootbox.alert("<strong>Basic command</strong>" +
					"<br />" +
					"<p><div class = 'commandHelp'>/join #NameOfChannel</div> -> Join or create the the channel #NameOfChannel</p>" +
					"<p><div class = 'commandHelp'>/nick newNicl</div> -> Change youre nickname</p>" +
					"<p><div class = 'commandHelp'>/part <#NameOfChannel></div> -> Part the channel #NameOfChannel or the current channel</p>" +
					"<p><div class = 'commandHelp'>/topic <#NameOfChannel></div> -> Print the topic of the channel #NameOf channel or the current channel</p>" +
					"<p><div class = 'commandHelp'>/topic #NameOfChannel newTopic</div> -> Set the topic of the channel newTopic</p>" +
					"<p><div class = 'commandHelp'>/kick #NameOfChannel NickOfUser</div> -> Kick the user of the channel (only the operators and admins could kick)</p>" +
					"<p><div class = 'commandHelp'>/names <#NameOfChannel></div> -> List the users in the channels with their abilitation @ : admin or operators</p>" +
					"<p><div class = 'commandHelp'>/list</div> -> List all the channels with their topic</p>" +
					"<p><div class = 'commandHelp'>/quit</div> -> Quit the server</p>" +
					"<p><div class = 'commandHelp'>/restart</div> -> Restart the server (only admin could)</p>" +
					"<p><div class = 'commandHelp'>/pass newPass</div> -> Change the password of your account</p>" +
					"<p><div class = 'commandHelp'>/who #NameOfChannel</div> -> List the detail of the users in the channel</p>" +
					"<p><div class = 'commandHelp'>/whois NickOfUser</div> -> Information of the user" +
					"<p><div class = 'commandHelp'>/away message</div> -> You can't receive privmsg and the message is put for user who want to privmsg you</p>" +
					"<p><div class = 'commandHelp'>/away</div> -> You are not away anymore</p>" +
					"<p><div class = 'commandHelp'>/invite NickOfUser #Channel</div> -> Invite an user to the channel (if the channel is +i)</p>" +
					"<p><div class = 'commandHelp'>/msg NickOfUser message</div> -> Send the privmsg message to the user</p>" +
					"<p><div class = 'commandHelp'>/privmsg #Channel message</div> -> Send message to the channel</p>" +
					"<p><div class = 'commandHelp'>/mute NickOfUser</div> -> mute an user</p>" +
					"<p><div class = 'commandHelp'>/demute NickOfUser</div> -> demute an user</p>" +
					"<p><div class = 'commandHelp'>/files <#Channel></div> -> Files in the channels</p>" +
					"<p><div class = 'commandHelp'>/rmfile #Channel linkUpload</div> -> delete the link file if link = * delete all links</p>" +
					"<p><div class = 'commandHelp'>/rmchan <#Channel></div> -> delete the channel</p>" +
					"<br /><strong>Command Advanced for operators or admins</strong>" +
					"<br /><p>Command channel /mode #Channel flag <DependsOfFlags> <DependOfFlags> :</p>" +
					"<p>You could combine certain flag together if their not in conflit and you cant put a +flag and a -flag in the same line</p>" +
					"<p>Command user /mode NickOf user flag (only for admins)</p>" +
					"<p>flag channel (+ or -) : b i o p s t n m l v k</p>" +
					"<p>flag user (+ or -) : i s w b o</p>" +
					"<p>The flags :</p>" +
					"<p>channel b -> Bann or debann an user (/mode #Channel +b NickOfUser) <div class = 'commandHelp'>/mode #Channel -b NickOfUser</div></p>" +
					"<p>channel o -> Upgrade an user to operator in the channel (or Downgrade) <div class = 'commandHelp'>/mode #Channel +o NickOfUSer</div></p>" +
					"<p>channel p -> The channel is private (name of channel is invisible) <div class = 'commandHelp'>/mode #Channel +p</div></p>" +
					"<p>channel s -> The channel is secret (channel invisible) <div class = 'commandHelp'>/mode #Channel +s</div></p>" +
					"<p>channel i -> The channel is now on invitation <div class = 'commandHelp'>/mode #Channel +i</div></p>" +
					"<p>channel t -> The topic could only be settled by operators <div class = 'commandHelp'>/mode #Channel +t</div></p>" +
					"<p>channel n -> The channel could not have message from user in other channels <div class = 'commandHelp'>/mode #Channel +n</div></p>" +
					"<p>channel m -> The channel is moderate <div class = 'commandHelp'>/mode #Channel +m</div></p>" +
					"<p>channel l -> Limits the number of users in the channels <div class = 'commandHelp'>/mode #Channel +l number</div></p>" +
					"<p>channel v -> Give or take the right to talk of an user in the moderate channel (need a channel moderate) <div class = 'commandHelp'>/mode #channel +v NickOfUser</div></p>" +
					"<p>channel k -> Put a key in the channel <div class = 'commandHelp'>/mode #Channel +k key</div></p>" +
					"<p>user i -> Put an user to invisible mode <div class = 'commandHelp'>/mode NickOfUser +i</div></p>" +
					"<p>user b -> Bann or debann a user in the server <div class = 'commandHelp'>/mode NickOfUser +b</div> <div class = 'commandHelp'>/mode NickOfUser -b</div></p>" +
					"<p>user o -> Upgrade a user to admin <div class = 'commandHelp'>/mode NickOfUser +o</div></p>" +
					"<p>user w -> The user could receive WALLOPS <div class = 'commandHelp'>/mode NickOfUser +w</div></p>" +
					"<p>user s -> Mark an user as receiving notification from server <div class = 'commandHelp'>/mode NickOfUser +s</div></p>" +
					"<strong>Quelques exemples de smiley</strong>" + 
					"<p>:ok_hand: <img class='emote' src = '../../images/ok_hand.png' /></p>" + 
					"<p>:pandab: <img class='emote' src = '../../images/pandab.png' /></p>" + 
					"<p>:surprised: <img class='emote' src = '../../images/surprised.png' /></p>" +
					"<p>:tong_close: <img class='emote' src = '../../images/tong_close.png' /></p>" +
					"<p>:tong_wink: <img class='emote' src = '../../images/tong_wink.png' /></p>" +
					"<p>:heart_eyes: <img class='emote' src = '../../images/heart_eyes.png' /></p>" +
					"<p>:sunglasses: <img class='emote' src = '../../images/sunglasses.png' /></p>" +
					"<p>:no_exp: <img class='emote' src = '../../images/no_exp.png' /></p>"
					);
	};
	
    $scope.sendMessage = function() {
		if($scope.newMessage.match(/^\/[a-z]+/g)) {
			var commandGeneral = (/^(\/[a-z]+)/g).exec($scope.newMessage);
			switch(commandGeneral[1]) {
				case "/join":
					var cmdJoin = $scope.newMessage.match(/^\/join[ ][\w\S]+$/);
					if(cmdJoin !== null) {
						var command = (/^\/join[ ]([\w\S]+)$/).exec($scope.newMessage);
						var commandParamJoin = command[1];
						userInfo.socket.emit("message", "JOIN " + commandParamJoin);
						if($scope.currentChannel.chan !== "@home") {
							for(var i = 0;i<$scope.channels.length; i++) {
								if(commandParamJoin === $scope.channels[i].chan) {
									$scope.channels[i].setNotifOff();
									$scope.currentChannel = $scope.channels[i];
									$scope.topicChannel = $scope.currentChannel.topic;
								}
							}
						}
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/part":
					var command = (/^\/part[ ]([\w\W]+)$/).exec($scope.newMessage);
					var commandP = (/^\/part$/).exec($scope.newMessage);
					if(command !== null) {
						var commandParamPart = command[1];
						var boolNoPart = false;
						var multiChannel = commandParamPart.split(' ');
						if(multiChannel[multiChannel.length-1][0] === ":") {
							boolNoPart = true;
							var messToPart = multiChannel[multiChannel.length-1];
							for(var i = 0; i<$scope.channels.length; i++) {
								if(multiChannel.includes($scope.channels[i].chan) === true) {
									userInfo.socket.emit("PRIVMSG " + $scope.channels[i].chan + " :" + messToPart);
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
									$scope.currentChannel = new Channel("@home");
									$scope.topicChannel = "PANDIRC";
								}
							}
						}
					}
					else if(commandP !== null) {
						if($scope.currentChannel.chan !== "@home") {
							if($scope.currentChannel.status === 0) {
								userInfo.socket.emit("message","PART " + $scope.currentChannel.chan);
							}
							else {
								if($scope.channels.length === 1) {
									$scope.channels.splice(0,1);
									$scope.currentChannel = new Channel("@home");
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
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/pass":
					var cmdPass = $scope.newMessage.match(/^\/pass[ ][\S\w]+$/);
					if(cmdPass !== null) {
						var command = (/^\/pass[ ]([\w\S]+)$/).exec($scope.newMessage);
						var commandPass = command[1];
						userInfo.socket.emit("message", "PASS " + commandPass);
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/rmchan":
					var cmdRmCh = $scope.newMessage.match(/^\/rmchan[ ][#][\S]+$/);
					var cmdRmChNoParam = $scope.newMessage.match(/^\/rmchan$/);
					if(cmdRmCh !== null) {
						var commandRmChan = (/^\/rmchan[ ]([#][\S]+)$/).exec($scope.newMessage);
						var rmChan = commandRmChan[1];
						userInfo.socket.emit("message", "RMCHAN " + rmChan);
					}
					else if(cmdRmChNoParam !== null) {
						if($scope.currentChannel.chan !== "@home") {
							userInfo.socket.emit("message", "RMCHAN " + $scope.currentChannel.chan);
						}
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/rmfile":
					var cmdRmFile = $scope.newMessage.match(/^\/rmfile[ ][#][\S]+[ ][\S]+$/);
					if(cmdRmFile !== null) {
						var commandRmFile = (/^\/rmfile[ ]([#][\S]+)[ ]([\S\w]+)$/).exec($scope.newMessage);
						var rmFileCh = commandRmFile[1];
						var rmFile = commandRmFile[2];
						userInfo.socket.emit("message", "RMFILE " + rmFileCh + " " + rmFile);
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/files":
					var cmdFiles = $scope.newMessage.match(/^\/files[ ][#][\S]+$/);
					var cmdFilesNoParam = $scope.newMessage.match(/^\/files$/);
					if(cmdFiles !== null) {
						var commandFiles = (/^\/files[ ]([#][\S]+)$/).exec($scope.newMessage);
						var filesCh = commandFiles[1];
						userInfo.socket.emit("message", "LISTFILES " + filesCh);
					}
					else if(cmdFilesNoParam !== null) {
						if($scope.currentChannel.chan !== "@home") {
							userInfo.socket.emit("message", "LISTFILES " + $scope.currentChannel.chan);
						}
						else {
							$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You should join a channel"]);
						}
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/topic":
					var cmdTopic = $scope.newMessage.match(/^\/topic[ ][#][\S]+[ ][\w\W]+$/);
					var cmdTopic1 = $scope.newMessage.match(/^\/topic[ ][#][\S]+$/);
					var cmdTopicNoParam = $scope.newMessage.match(/^\/topic$/);
					if(cmdTopic !== null) {
						var command = (/^\/[a-z]+[ ]([#][\S]+)[ ]([\w\W]+)$/).exec($scope.newMessage);
						var commandChannel = command[1];
						var commandMess = command[2];
						if(commandMess.length <=60) {
							boolAskTopic = false;
							userInfo.socket.emit("message","TOPIC " + commandChannel + " " + commandMess);
						}
						else {
							$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Text must be less or equals than 60"]);
						}
					}
					else if(cmdTopic1 !== null) {
						var command = (/^\/[a-z]+[ ]([#][a-zA-Z0-9]+)$/).exec($scope.newMessage);
						boolAskTopic = true;
						userInfo.socket.emit("message","TOPIC " + command[1]);
					}
					else if(cmdTopicNoParam !== null) {
						if($scope.currentChannel.chan !== "@home") {
							userInfo.socket.emit("message", "TOPIC " + $scope.currentChannel.chan);
						}
						else {
							$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must be in a channel"]);
						}
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/kick":
					var cmdKick = $scope.newMessage.match(/^\/kick[ ][#][\S]+[ ][\w\S]+$/);
					if(cmdKick !== null) {
						var cmdK = $scope.newMessage.split(" ");
						if(cmdK[1].includes("#")) {
							for(var i = 0; i<$scope.channels.length; i++) {
								if(cmdK[1] === $scope.channels[i].chan) {
									for(var j = 2; j<cmdK.length; j++) {
										userInfo.socket.emit("message", "KICK " + cmdK[1] + " " + cmdK[j]);
									}
								}
								else {
									$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You're not subscribe on that channel"]);
								}
							}
						}
						else {
							$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The second argument must be a channel"]);
						}
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/msg":
					var cmdMess = $scope.newMessage.match(/^\/msg[ ][\w\S]+[ ][\w\W]+$/);
					if(cmdMess !== null) {
						var command = (/^\/msg[ ]([\w\S]+)[ ]([\w\W]+)$/).exec($scope.newMessage);			
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
						if($scope.currentChannel.chan !== "@home") {
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
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/invite":
					var cmdInvite = $scope.newMessage.match(/^\/invite[ ][\w\S]+[ ][\w\S]+$/);
					if(cmdInvite !== null) {
						var cmdInvit = (/^\/invite[ ]([\w\S]+)[ ]([\w\S]+)$/).exec($scope.newMessage);
						var cmdInvitUser = cmdInvit[1];
						var cmdInvitCh = cmdInvit[2];
						userInfo.socket.emit("message", "INVITE " + cmdInvitUser + " " + cmdInvitCh);
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/away":
					var cmdAway = $scope.newMessage.match(/^\/away[ ][\w\W]+$/);
					if(cmdAway !== null) {
						var cmdA = (/^\/away[ ]([\w\W]+)$/).exec($scope.newMessage);
						var cmdAwayMess = cmdA[1];
						userInfo.socket.emit("message", "AWAY : " + cmdAwayMess);
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/back":
					var cmdAwayNoParam = $scope.newMessage.match(/^\/back$/);
					if(cmdAwayNoParam !== null) {
						userInfo.socket.emit("message", "AWAY");
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/privmsg":
					var cmdPrivMsg = $scope.newMessage.match(/^\/privmsg[ ][#][\w\S]+[ ][\W\w]+$/);
					if(cmdPrivMsg !== null) {
						var cmdPrivMsg = (/^\/privmsg[ ]([#][\w\S]+)[ ]([\W\s]+)$/).exec($scope.newMessage);
						var cmdPrivMsgChan = cmdPrivMsg[1];
						var cmdPrivM = cmdPrivMsg[2];
						userInfo.socket.emit("message", "PRIVMSG " + cmdPrivMsgChan + " :" + cmdPrivM);
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/names":
					var cmdNames = $scope.newMessage.match(/^\/names[ ][\w\S]+$/);
					var cmdNamesNoParam = $scope.newMessage.match(/^\/names$/);
					if(cmdNames !== null) {
						var command = (/^\/names[ ]([\w\S]+)$/).exec($scope.newMessage);
						boolNames = true;
						userInfo.socket.emit("message", "NAMES " + command[1]);
					}
					else if(cmdNamesNoParam !== null) {
						boolNames = true;
						userInfo.socket.emit("message", "NAMES");
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/restart":
					var commandRst = $scope.newMessage.match(/^\/restart$/);
					if(commandRst !== null) {
						userInfo.socket.emit("message", "RESTART");
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/quit":
					var commandQuit = $scope.newMessage.match(/^\/quit$/);
					if(commandQuit !== null) {
						userInfo.socket.emit("message", "QUIT");
						$window.location.href = landingUrl;
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/whois":
					var commandWhois = $scope.newMessage.match(/^\/whois[ ][\w\S]+$/);
					var commandWhoisNoP = $scope.newMessage.match(/^\/whois$/);
					if(commandWhois !== null) {
						var command = (/^\/whois[ ]([\w\S]+)$/).exec($scope.newMessage);
						var commandUser = command[1];
						userInfo.socket.emit("message", "WHOIS " + commandUser);
					}
					else if(commandWhoisNoP !== null) {
						if($scope.currentChannel.status === 1) {
							userInfo.socket.emit("message", "WHOIS " + $scope.currentChannel.chan);
						}
						else {
							$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You should put a user after your command"]);
						}
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/who":
					var commandWho = $scope.newMessage.match(/^\/who[ ][\w\S]+$/);
					var commandWhoNoParam = $scope.newMessage.match(/^\/who$/);
					if(commandWho !== null) {
						var cmdWho = (/^\/who[ ]([\w\S]+)$/).exec($scope.newMessage);
						var cmdWhoCh = cmdWho[1];
						userInfo.socket.emit("message", "WHO " + cmdWhoCh);
					}
					else if(commandWhoNoParam !== null){
						if($scope.currentChannel.chan !== "@home") {
							userInfo.socket.emit("message", "WHO " + $scope.currentChannel.chan);
						}
						else {
							$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You should join a channel"]);
						}
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/list":
					var commandList = $scope.newMessage.match(/^\/list$/);
					if(commandList !== null) {
						userInfo.socket.emit("message", "LIST");
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/nick":
					var commandNick = $scope.newMessage.match(/^\/nick[ ][\S]+$/);
					if(commandNick !== null) {
						var cmdNick = (/^\/nick[ ]([\S]+)$/).exec($scope.newMessage);
						var nickCommand = cmdNick[1];
						userInfo.socket.emit("message", "NICK " + nickCommand);
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/mute":
					var cmdMute = $scope.newMessage.match(/^\/mute[ ][\S\w]+$/);
					if(cmdMute !== null) {
						var cmdM = (/^\/mute[ ]([\S\w]+)$/).exec($scope.newMessage);
						var cmdMUser = cmdM[1];
						isCmdMute = true;
						userInfo.socket.emit("message", "WHOIS " + cmdMUser);
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/demute":
					var cmdDeMute = $scope.newMessage.match(/^\/demute[ ][\S\w]+$/);
					if(cmdDeMute !== null) {
						var cmdM = (/^\/demute[ ]([\S\w]+)$/).exec($scope.newMessage);
						var cmdDeMuteUser = cmdM[1];
						if(user.mute.includes(cmdDeMuteUser)) {
							user.removeUserMute(cmdDeMuteUser);
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You have demuted " + cmdDeMuteUser]);
						}
						else {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user is not in your mute list"]);
						}
					}
					else {
						$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
					}
					break;
				case "/mode":
					var cmdMode = $scope.newMessage.match(/^\/mode[ ][\w\W]+$/);
					if(cmdMode !== null) {
						var modeL = [[false, "+"], [false, "-"], [false, "o"], [false, "s"], [false, "i"], [false, "t"], [false, "n"], [false, "m"], [false, "l"], [false, "b"], [false, "v"], [false, "k"], [false, "w"], [false, "p"]];
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
												modeL[13][0] = true;
											}
											if(cmd[2].includes("s")) {
												modeL[3][0] = true;
											}
											if(cmd[2].includes("i")) {
												modeL[4][0] = true;
											}
											if(cmd[2].includes("t")) {
												modeL[5][0] = true;
											}
											if(cmd[2].includes("n")) {
												modeL[6][0] = true;
											}
											if(cmd[2].includes("m")) {
												modeL[7][0] = true;
											}
										}
										else {
											$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
										}
									}
									else if(cmd[2].includes("o") && cmd[2][0] === "-" && (cmd[2].includes("l") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("v") === false) && (cmd[2].includes("k") === false)) {
										if(cmd[3] !== undefined  && cmd[3] !== "") {
											modeL[1][0] = true;
											modeL[2][0] = true;
											if(cmd[2].includes("p")) {
												modeL[13][0] = true;
											}
											if(cmd[2].includes("s")) {
												modeL[3][0] = true;
											}
											if(cmd[2].includes("i")) {
												modeL[4][0] = true;
											}
											if(cmd[2].includes("t")) {
												modeL[5][0] = true;
											}
											if(cmd[2].includes("n")) {
												modeL[6][0] = true;
											}
											if(cmd[2].includes("m")) {
												modeL[7][0] = true;
											}
										}
										else {
											$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
										}
									}
									else if(cmd[2].includes("l") && cmd[2][0] === "+" && (cmd[2].includes("o") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("v") === false) && (cmd[2].includes("k") === false)) {
										if(cmd[3] !== undefined  && cmd[3] !== "") {
											modeL[8][0] = true;
											modeL[0][0] = true;
											if(cmd[2].includes("p")) {
												modeL[13][0] = true;
											}
											if(cmd[2].includes("s")) {
												modeL[3][0] = true;
											}
											if(cmd[2].includes("i")) {
												modeL[4][0] = true;
											}
											if(cmd[2].includes("t")) {
												modeL[5][0] = true;
											}
											if(cmd[2].includes("n")) {
												modeL[6][0] = true;
											}
											if(cmd[2].includes("m")) {
												modeL[7][0] = true;
											}
										}
										else {
											$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
										}
									}
									else if(cmd[2].includes("b") && cmd[2][0] === "-" && (cmd[2].includes("o") === false) && (cmd[2].includes("l") === false) && (cmd[2].includes("v") === false) && (cmd[2].includes("k") === false)) {
										if(cmd[3] !== undefined  && cmd[3] !== "" && cmd[4] !== undefined && cmd[4] !== "") {
											modeL[9][0] = true;
											modeL[1][0] = true;
											if(cmd[2].includes("p")) {
												modeL[13][0] = true;
											}
											if(cmd[2].includes("s")) {
												modeL[3][0] = true;
											}
											if(cmd[2].includes("i")) {
												modeL[4][0] = true;
											}
											if(cmd[2].includes("t")) {
												modeL[5][0] = true;
											}
											if(cmd[2].includes("n")) {
												modeL[6][0] = true;
											}
											if(cmd[2].includes("m")) {
												modeL[7][0] = true;
											}
										}
										else {
											$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
										}
									}
									else if(cmd[2].includes("b") && cmd[2][0] === "+" && (cmd[2].includes("o") === false) && (cmd[2].includes("l") === false) && (cmd[2].includes("v") === false) && (cmd[2].includes("k") === false)) {
										if(cmd[3] !== undefined  && cmd[3] !== "" && cmd[4] !== undefined && cmd[4] !== "") {
											modeL[9][0] = true;
											modeL[0][0] = true;
											if(cmd[2].includes("p")) {
												modeL[13][0] = true;
											}
											if(cmd[2].includes("s")) {
												modeL[3][0] = true;
											}
											if(cmd[2].includes("i")) {
												modeL[4][0] = true;
											}
											if(cmd[2].includes("t")) {
												modeL[5][0] = true;
											}
											if(cmd[2].includes("n")) {
												modeL[6][0] = true;
											}
											if(cmd[2].includes("m")) {
												modeL[7][0] = true;
											}
										}
										else {
											$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
										}
									}
									else if(cmd[2].includes("v") && cmd[2][0] === "+" && (cmd[2].includes("o") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("l") === false) && (cmd[2].includes("k") === false)) {
										if(cmd[3] !== undefined  && cmd[3] !== "") {
											modeL[10][0] = true;
											modeL[0][0] = true;
											if(cmd[2].includes("p")) {
												modeL[13][0] = true;
											}
											if(cmd[2].includes("s")) {
												modeL[3][0] = true;
											}
											if(cmd[2].includes("i")) {
												modeL[4][0] = true;
											}
											if(cmd[2].includes("t")) {
												modeL[5][0] = true;
											}
											if(cmd[2].includes("n")) {
												modeL[6][0] = true;
											}
											if(cmd[2].includes("m")) {
												modeL[7][0] = true;
											}
										}
										else {
											$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
										}
									}
									else if(cmd[2].includes("v") && cmd[2][0] === "-" && (cmd[2].includes("o") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("l") === false) && (cmd[2].includes("k") === false)) {
										if(cmd[3] !== undefined  && cmd[3] !== "") {
											modeL[10][0] = true;
											modeL[1][0] = true;
											if(cmd[2].includes("p")) {
												modeL[13][0] = true;
											}
											if(cmd[2].includes("s")) {
												modeL[3][0] = true;
											}
											if(cmd[2].includes("i")) {
												modeL[4][0] = true;
											}
											if(cmd[2].includes("t")) {
												modeL[5][0] = true;
											}
											if(cmd[2].includes("n")) {
												modeL[6][0] = true;
											}
											if(cmd[2].includes("m")) {
												modeL[7][0] = true;
											}
										}
										else {
											$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
										}
									}
									else if(cmd[2].includes("k") && cmd[2][0] === "+" && (cmd[2].includes("o") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("l") === false) && (cmd[2].includes("v") === false)) {
										if(cmd[3] !== undefined  && cmd[3] !== "") {
											modeL[11][0] = true;
											modeL[0][0] = true;
											if(cmd[2].includes("p")) {
												modeL[13][0] = true;
											}
											if(cmd[2].includes("s")) {
												modeL[3][0] = true;
											}
											if(cmd[2].includes("i")) {
												modeL[4][0] = true;
											}
											if(cmd[2].includes("t")) {
												modeL[5][0] = true;
											}
											if(cmd[2].includes("n")) {
												modeL[6][0] = true;
											}
											if(cmd[2].includes("m")) {
												modeL[7][0] = true;
											}
										}
										else {
											$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put a keyword"]);
										}
									}
									else if(cmd[2].includes("k") && cmd[2][0] === "-" && (cmd[2].includes("o") === false) && (cmd[2].includes("b") === false) && (cmd[2].includes("l") === false) && (cmd[2].includes("v") === false)) {
										if(cmd[3] === undefined) {
											modeL[11][0] = true;
											modeL[1][0] = true;
											if(cmd[2].includes("p")) {
												modeL[13][0] = true;
											}
											if(cmd[2].includes("s")) {
												modeL[3][0] = true;
											}
											if(cmd[2].includes("i")) {
												modeL[4][0] = true;
											}
											if(cmd[2].includes("t")) {
												modeL[5][0] = true;
											}
											if(cmd[2].includes("n")) {
												modeL[6][0] = true;
											}
											if(cmd[2].includes("m")) {
												modeL[7][0] = true;
											}
										}
										else {
											$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You have too much parameter"]);
										}
									}
									else {
										if(cmd[3] === undefined) {
											if(cmd[2][0] === "+" && cmd[2][1] !== undefined) {
												modeL[0][0] = true;
												if(cmd[2].includes("p")) {
													modeL[13][0] = true;
												}
												if(cmd[2].includes("s")) {
													modeL[3][0] = true;
												}
												if(cmd[2].includes("i")) {
													modeL[4][0] = true;
												}
												if(cmd[2].includes("t")) {
													modeL[5][0] = true;
												}
												if(cmd[2].includes("n")) {
													modeL[6][0] = true;
												}
												if(cmd[2].includes("m")) {
													modeL[7][0] = true;
												}
											}
											else if(cmd[2][0] === "-" && cmd[2][1] !== undefined) {
												modeL[1][0] = true;
												if(cmd[2].includes("p")) {
													modeL[13][0] = true;
												}
												if(cmd[2].includes("s")) {
													modeL[3][0] = true;
												}
												if(cmd[2].includes("i")) {
													modeL[4][0] = true;
												}
												if(cmd[2].includes("t")) {
													modeL[5][0] = true;
												}
												if(cmd[2].includes("n")) {
													modeL[6][0] = true;
												}
												if(cmd[2].includes("m")) {
													modeL[7][0] = true;
												}
											}
											else {
												$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must add a flag!!"]);
											}
										}
										else {
											$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Check if your flag is compatible and if you have too much argument"]);
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
									else if(cmd[3] !== undefined && cmd[4] !== undefined && flag.includes("b")){
										userInfo.socket.emit("message", "MODE " + cmd[1] + " " + flag + " " + cmd[3] + " " + cmd[4]);
									}
									else if(cmd[3] !== undefined) {
										userInfo.socket.emit("message", "MODE " + cmd[1] + " " + flag + " " + cmd[3]);
									}
									else {
										$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error - check if the argument is good"]);
									}
								}
								else {
									$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You're not subscribe on that channel"]);
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
											modeL[4][0] = true;
										}
										if(cmd[2].includes("s")) {
											modeL[3][0] = true;
										}
										if(cmd[2].includes("w")) {
											modeL[12][0] = true;
										}
										if(cmd[2].includes("o")) {
											modeL[2][0] = true;
										}
										if(cmd[2].includes("b")) {
											modeL[9][0] = true;
										}
									}
									else if(cmd[2][0] === "-") {
										modeL[1][0] = true;
										if(cmd[2].includes("i")) {
											modeL[4][0] = true;
										}
										if(cmd[2].includes("s")) {
											modeL[3][0] = true;
										}
										if(cmd[2].includes("w")) {
											modeL[12][0] = true;
										}
										if(cmd[2].includes("o")) {
											modeL[2][0] = true;
										}
										if(cmd[2].includes("b")) {
											modeL[9][0] = true;
										}
									}
									var flag = "";
									for(var i = 0; i<modeL.length; i++) {
										if(modeL[i][0] === true) {
											flag = flag + modeL[i][1];
										}
									}
									if(flag === "") {
										$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "This is not available flag"]);
									}
									else if(cmd[3] === undefined || cmd[3] === ""){
										userInfo.socket.emit("message", "MODE " + cmd[1] + " " + flag);
									}
									else if(cmd[3] !== undefined && cmd[3] !== "") {
										userInfo.socket.emit("message", "MODE " + cmd[1] + " " + flag + " " + cmd[3]);
									}
									else {
										$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error in argument"]);
									}
								}
								else {
									$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must have flag"]);
								}
							}
							else {
								$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You must put an user"]);
							}
						}
					}
					break;
				default:
					$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "This is not a command"]);
			}
			$scope.newMessage = undefined;
			$scope.$apply();
		}
		else if($scope.currentChannel.chan !== "@home" && $scope.newMessage !== ""){
            userInfo.socket.emit("message","PRIVMSG " + $scope.currentChannel.chan + " :" + $scope.newMessage);
			if($scope.newMessage.match(/^http:\/\/[\S]+$/) || $scope.newMessage.match(/^https:\/\/[\S]+$/)) {
				$scope.currentChannel.messages.push([userFile, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "<div class='messInBox'><p class='class-user-file'>" + user.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + $scope.newMessage + "' target='_blank'>" + $scope.newMessage + "</a></p></div>"]);
			}
			else {
				var isEmote = changeToEmoji($scope.newMessage);
				if(isEmote !== false) {
					$scope.currentChannel.messages.push([userFile, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "<div class='messInBox'><p class='class-user-file'>" + user.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>" + isEmote + "</p></div>"]);
				}
				else {
					$scope.currentChannel.messages.push([user, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), $scope.newMessage]);
				}
			}
			$scope.newMessage = undefined;
        }
		else if($scope.newMessage !== ""){
			$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Please join a channel"]);
			userInfo.socket.emit("message", "LIST");
			$scope.newMessage = undefined;
		}
		$scope.$apply();
    }
	
	userInfo.socket.on("connect_error", function() {
		bootbox.alert("Can't connect to the server" + user.server);
		$window.location.href = landingUrl;
	});
	
	userInfo.socket.on("disconnect", function() {
		bootbox.alert("Disconnecting");
		$window.location.href = landingUrl;
	});
	
    userInfo.socket.on("message", function(msg) {
		var rspGeneral = (/^[\S]+[ ]([\S]+)[ ][\w\W]+$/).exec(msg);
		switch(rspGeneral[1]) {
			case "433":
				if(connect !== true) {
					var xHeight = $(document).height();
					var xWidth = $(window).width();
					$("#masque").css({"width":xWidth,"height":xHeight});
					$("#masque").fadeIn();
					$("#masque").fadeTo("fast",0.6);
					$("#dialog").css("top", (xHeight/2) - (70/2));
					$("#dialog").css("left", (xWidth/2) - (524/2));
					$("#dialog").fadeIn();
				}
				else {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Le pseudo est deja utilisé"]);
				}
				break;
			case "PRIVMSG":
				if(msg.match(/^[:]@[\w\S]+[ ]PRIVMSG[ ]@global[ ][:][\S\W]+$/)) {
					var globalMessage = (/^[:][@]([\w\S]+)[ ]PRIVMSG[ ]@global[ ][:]([\S\W]+)$/).exec(msg);
					var adminGlobalM = new User(globalMessage[1]);
					adminGlobalM.setRight(1);
					var adMsg = globalMessage[2];
					
					if(adMsg.match(/^http:\/\/[\S]+(.fr|.com)$/)) {
						for(var i = 0; i<$scope.channels.length; i++) {
							$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + adminGlobalM.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + adMsg + "' target='_blank'>" + adMsg + "</a></p></div>"]);
						}
						$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + adminGlobalM.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + adMsg + "' target='_blank'>" + adMsg + "</a></p></div>"]);
					}
					else if(adMsg.match(/^https:\/\/[\S]+(.fr|.com)$/)) {
						for(var i = 0; i<$scope.channels.length; i++) {
							$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + adminGlobalM.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + adMsg + "' target='_blank'>" + adMsg + "</a></p></div>"]);
						}
						$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + adminGlobalM.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + adMsg + "' target='_blank'>" + adMsg + "</a></p></div>"]);
					}
					else {
						var isEmote = changeToEmoji(adMsg);
						if(isEmote !== false) {
							for(var i = 0; i<$scope.channels.length; i++) {
								$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + adminGlobalM.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>" + isEmote + "</p></div>"]);
							}
							$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + adminGlobalM.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>" + isEmote + "</p></div>"]);
						}
						else {
							for(var i = 0; i<$scope.channels.length; i++) {
								$scope.channels[i].messages.push([adminGlobalM, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), adMsg]);
							}
							$scope.currentChannel.messages.push([adminGlobalM, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), adMsg]);
						}
					}
				}
				else if(msg.match(/^[:][\w\S]+[ ]PRIVMSG[ ][#][\w\S]+[ ][:][\S\W]+$/)) {
					var regxMess = (/^[:]([\w\S]+)[ ]PRIVMSG[ ]([#][\w\S]+)[ ][:]([\S\W]+)$/).exec(msg);
					var regxUser = new User(regxMess[1]);
					var regxChannel = regxMess[2];
					var regxMsg = regxMess[3];
					
					if(user.mute.includes(regxUser.nick) === false) {
						if($scope.currentChannel.chan !== regxChannel) {
							for(var i = 0; i<$scope.channels.length; i++) {
								if(regxChannel === $scope.channels[i].chan) {
									regxUser = isAdmin(regxUser, $scope.channels[i]);
									var regFileWithMess = new RegExp("^" + user.server + ":3001[\\S]+[ ][\\S]+", "g");
									var regFileWithoutMess = new RegExp("^" + user.server + ":3001[\\S]+$");
									if(regxMsg.match(regFileWithMess)) {
										var tabFile = regxMsg.split(" ");
										var urlFile = tabFile[0];
										var mess = tabFile[1];
										for(var j = 2; j<tabFile.length; j++) {
											mess = mess + " " + tabFile[j];
										}
										if(regxUser.right === 1) {//operator or creator of channel
											if(isImage(urlFile)) {
												var img = new Image();
												img.onload = function() {
													var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
													$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + urlFile + "' target='_blank'>" + urlFile + "</a></p><p>" + mess + "</p><p><a href='" + urlFile + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + urlFile + "'/></a></p></div>"]);
													$scope.$apply();
												}
												img.src = urlFile;
											}
											else {
												$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + urlFile + "' target='_blank'>" + urlFile + "</a></p><p>" + mess + "</p></div>"]);
											}
										}
										else {//simpleuser
											if(isImage(urlFile)) {
												var img = new Image();
												img.onload = function() {
													var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
													$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + urlFile + "' target='_blank'>" + urlFile + "</a></p><p>" + mess + "</p><p><a href='" + urlFile + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + urlFile + "'/></a></p></div>"]);
													$scope.$apply();
												}
												img.src = urlFile;
											}
											else {
												$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + urlFile + "' target='_blank'>" + urlFile + "</a></p><p>" + mess + "</p></div>"]);
											}
										}
									}
									else if(regxMsg.match(regFileWithoutMess)) {
										if(regxUser.right === 1) {//operator or creator of channel
											if(isImage(regxMsg)) {
												var img = new Image();
												img.onload = function() {
													var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
													$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p><p><a href='" + regxMsg + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + regxMsg + "'/></a></p></div>"]);
													$scope.$apply();
												}
												img.src = regxMsg;
											}
											else {
												$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
											}
										}
										else {//simpleuser
											if(isImage(regxMsg)) {
												var img = new Image();
												img.onload = function() {
													var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
													$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p><p><a href='" + regxMsg + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + regxMsg + "'/></a></p></div>"]);
													$scope.$apply();
												}
												img.src = regxMsg;
											}
											else {
												$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
											}
										}
									}
									else if(regxMsg.match(/^http:\/\/[\S]+(.fr|.com)$/)) {
										if(regxUser.right === 1) {
											$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
										}
										else {
											$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
										}
									}
									else if(regxMsg.match(/^https:\/\/[\S]+(.fr|.com)$/)) {
										if(regxUser.right === 1) {
											$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
										}
										else {
											$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
										}
									}
									else {
										var isEmote = changeToEmoji(regxMsg);
										if(isEmote !== false) {
											if(regxUser.right === 1) {
												$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>" + isEmote + "</p></div>"]);
											}
											else {
												$scope.channels[i].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>" + isEmote + "</p></div>"]);
											}
										}
										else {
											$scope.channels[i].messages.push([regxUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), regxMsg]);
										}
									}
									if($scope.channels[i].notif !== 2) {
										$scope.channels[i].setNotifOn();
									}
								}
							}
						}
						else {
							regxUser = isAdmin(regxUser, $scope.currentChannel);			
							var regFileWithMess = new RegExp("^" + user.server + ":3001[\\S]+[ ][\\S]+", "g");
							var regFileWithoutMess = new RegExp("^" + user.server + ":3001[\\S]+$");
							if(regxMsg.match(regFileWithMess)) {
								var tabFile = regxMsg.split(" ");
								var urlFile = tabFile[0];
								var mess = tabFile[1];
								for(var j = 2; j<tabFile.length; j++) {
									mess = mess + " " + tabFile[j];
								}
								if(regxUser.right === 1) {//operator or creator of channel
									if(isImage(urlFile)) {
										var img = new Image();
											img.onload = function() {
												var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
												$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + urlFile + "' target='_blank'>" + urlFile + "</a></p><p>" + mess + "</p><p><a href='" + urlFile + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + urlFile + "'/></a></p></div>"]);
												$scope.$apply();
											}
										img.src = urlFile;
									}
									else {
										$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + urlFile + "' target='_blank'>" + urlFile + "</a></p><p>" + mess + "</p></div>"]);
									}
								}
								else {//simpleuser
									if(isImage(urlFile)) {
										var img = new Image();
										img.onload = function() {
											var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
											$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + urlFile + "' target='_blank'>" + urlFile + "</a></p><p>" + mess + "</p><p><a href='" + urlFile + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + urlFile + "'/></a></p></div>"]);
											$scope.$apply();
										}
										img.src = urlFile;
									}
									else {
										$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + urlFile + "' target='_blank'>" + urlFile + "</a></p><p>" + mess + "</p></div>"]);
									}
								}
							}
							else if(regxMsg.match(regFileWithoutMess)) {
								if(regxUser.right === 1) {//operator or creator of channel
									if(isImage(regxMsg)) {
										var img = new Image();
										img.onload = function() {
											var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
											$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p><p><a href='" + regxMsg + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + regxMsg + "'/></a></p></div>"]);
											$scope.$apply();
										}
										img.src = regxMsg;
									}
									else {
										$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
									}
								}
								else {//simpleuser
									if(isImage(regxMsg)) {
										var img = new Image();
										img.onload = function() {
											var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
											$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p><p><a href='" + regxMsg + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + regxMsg + "'/></a></p></div>"]);
											$scope.$apply();
										}
										img.src = regxMsg;
									}
									else {
										$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
									}
								}
							}
							else if(regxMsg.match(/^http:\/\/[\S]+(.fr|.com)$/)) {
								if(regxUser.right === 1) {
									$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
								}
								else {
									$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
								}
							}
							else if(regxMsg.match(/^https:\/\/[\S]+(.fr|.com)$/)) {
								if(regxUser.right === 1) {
									$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
								}
								else {
									$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
								}
							}
							else {
								var isEmote = changeToEmoji(regxMsg);
								if(isEmote !== false) {
									if(regxUser.right === 1) {
										$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-operator-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>" + isEmote + "</p></div>"]);
									}
									else {
										$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser.nick + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>" + isEmote + "</p></div>"]);
									}
								}
								else {
									$scope.currentChannel.messages.push([regxUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), regxMsg]);
								}
							}
						}
					}
				}
				else if(msg.match(/^[:][\w\S]+[ ]PRIVMSG[ ][\w\S]+[ ][:][a-zA-Z0-9\W]+$/)) {
					var bool = false;
					var regxMess = (/^[:]([\w\S]+)[ ]PRIVMSG[ ]([\w\S]+)[ ][:]([a-zA-Z0-9\W]+)$/).exec(msg);
					var regxUser = regxMess[1];
					var regxUser2 = regxMess[2];
					var regxMsg = regxMess[3];
					var whispToAdd = new Whisper(regxUser);
					var userToAdd = new User(regxUser);
					// update
					if($scope.currentChannel.chan !== "@home") {
						for(var i = 0; i<$scope.channels.length; i++) {
							if($scope.channels[i].chan === $scope.currentChannel.chan) {
								$scope.channels[i] = $scope.currentChannel;
							}
						}
					}
					if(user.mute.includes(regxUser) === false) {
						for(var i = 0; i<$scope.channels.length; i++) {
							if($scope.channels[i].chan === userToAdd.nick) {
								bool = true;
								var count = i;
							}
						}
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
							if($scope.currentChannel.chan === regxUser) {
								var regFileWithMess = new RegExp("^" + user.server + ":3001[\\S]+[ ][\\S]+", "g");
								var regFileWithoutMess = new RegExp("^" + user.server + ":3001[\\S]+$");
								if(regxMsg.match(regFileWithMess) !== null) {
									var tabFile = regxMsg.split(" ");
									var urlFile = tabFile[0];
									var mess = tabFile[1];
									for(var j = 2; j<tabFile.length; j++) {
										mess = mess + " " + tabFile[j];
									}
									if(isImage(urlFile)) {
										var img = new Image();
										img.onload = function() {
											var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
											$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + urlFile + "' target='_blank'>" + urlFile + "</a></p><p>" + mess + "</p><p><a href='" + urlFile + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + urlFile + "'/></a></p></div>"]);
											$scope.$apply();
										}
										img.src = urlFile;
									}
									else {
										$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + urlFile + "' target='_blank'>" + urlFile + "</a></p><p>" + mess + "</p></div>"]);
									}
									
								}
								else if(regxMsg.match(regFileWithoutMess) !== null) {
									if(isImage(regxMsg)) {
										var img = new Image();
										img.onload = function() {
											var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
											$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p><p><a href='" + regxMsg + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + regxMsg + "'/></a></p></div>"]);
											$scope.$apply();
										}
										img.src = regxMsg;
									}
									else {
										$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
									}
								}
								else if(regxMsg.match(/^http:\/\/[\S]+(.fr|.com)$/)) {
									$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
								}
								else if(regxMsg.match(/^https:\/\/[\S]+(.fr|.com)$/)) {
									$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
								}
								else {
									var isEmote = changeToEmoji(regxMsg);
									if(isEmote !== false) {
										$scope.currentChannel.messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>" + isEmote + "</p></div>"]);
									}
									else {
										$scope.currentChannel.messages.push([regxUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), regxMsg]);
									}
								}
							}
							else {
								var regFileWithMess = new RegExp("^" + user.server + ":3001[\\S]+[ ][\\S]+", "g");
								var regFileWithoutMess = new RegExp("^" + user.server + ":3001[\\S]+$");
								if(regxMsg.match(regFileWithMess)) {
									var tabFile = regxMsg.split(" ");
									var urlFile = tabFile[0];
									var mess = tabFile[1];
									for(var j = 2; j<tabFile.length; j++) {
										mess = mess + " " + tabFile[j];
									}
									if(isImage(urlFile)) {
										var img = new Image();
										img.onload = function() {
											var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
											$scope.channels[count].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + urlFile + "' target='_blank'>" + urlFile + "</a></p><p>" + mess + "</p><p><a href='" + urlFile + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + urlFile + "'/></a></p></div>"]);
											$scope.$apply();
										}
										img.src = urlFile;
									}
									else {
										$scope.channels[count].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + urlFile + "' target='_blank'>" + urlFile + "</a></p><p>" + mess + "</p></div>"]);
									}
									
								}
								else if(regxMsg.match(regFileWithoutMess)) {
									if(isImage(regxMsg)) {
										var img = new Image();
										img.onload = function() {
											var tabMiniature = miniature(parseInt(this.width), parseInt(this.height));
											$scope.channels[count].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p><p><a href='" + regxMsg + "' target='_blank'><img style='width:" + tabMiniature[0] + "px;height:" + tabMiniature[1] + "px' src='" + regxMsg + "'/></a></p></div>"]);
											$scope.$apply();
										}
										img.src = regxMsg;
									}
									else {
										$scope.channels[count].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
									}
								}
								else if(regxMsg.match(/^http:\/\/[\S]+(.fr|.com)$/)) {
									$scope.channels[count].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
								}
								else if(regxMsg.match(/^https:\/\/[\S]+(.fr|.com)$/)) {
									$scope.channels[count].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p><a href='" + regxMsg + "' target='_blank'>" + regxMsg + "</a></p></div>"]);
								}
								else {
									var isEmote = changeToEmoji(regxMsg);
									if(isEmote !== false) {
										$scope.channels[count].messages.push([userFile, "", "<div class='messInBox'><p class='class-default-file'>" + regxUser + "</p> <p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>" + isEmote + "</p></div>"]);
									}
									else {
										$scope.channels[count].messages.push([regxUser, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), regxMsg]);
									}
								}
								if($scope.channels[count].notif !== 2) {
									$scope.channels[count].setNotifOn();
								}
							}
						}
					}
				}
				break;
			case "NICK":
				connect = true;
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
				
				if(user.mute.includes(oldname)) {
					user.mute[user.mute.indexOf(oldname)] = msgToPush[1];
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
				break;
			case "KICK":
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
							$scope.currentChannel = new Channel("@home");
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
				break;
			case "JOIN":
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
					if(admin.includes(newUser.nick) === false && newUser.nick !== user.nick) {
						admin.push(newUser.nick);
					}
				}
				if($scope.currentChannel.chan !== "@home") {
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
				break;
			case "PART":
				var chann = in_isChannel(msg);
				if(user.nick === chann[0]) {
					if($scope.channels.length === 1) {
						$scope.channels.splice(0,1);
						$scope.currentChannel = new Channel("@home");
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
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), chann[0] + " leave the channel " + chann[1]]);
				}
				else {
					for(var i = 0; i<$scope.channels.length; i++) {
						if($scope.channels[i].chan === chann[1]) {
							boolNames = false;
							userInfo.socket.emit("message","NAMES " + $scope.channels[i].chan);
							$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), chann[0] + " leave the channel"]);
							if($scope.channels[i].notif !== 2) {
								$scope.channels[i].setNotifOn();
							}
						}
					}
				}
				break;
			case "QUIT":
				var rspQuit = (/^:([\w\S]+)[ ]QUIT[ ][:]([\S\w]+)$/).exec(msg);
				var rspQuitUser = rspQuit[1];
				var rspQuitMess = rspQuit[2];
				rspQuitUser = rspQuitUser.replace("@","");
				for(var i = 0; i<$scope.channels.length; i++) {
					for(var j = 0; j<$scope.channels[i].listU.length; j++) {
						if($scope.channels[i].listU[j].nick === rspQuitUser) {
							$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspQuitUser + " has leave the server, msg :" + rspQuitMess]);
							break;
						}
					}
				}
				for(var i = 0; i<$scope.currentChannel.listU.length; i++) {
					if($scope.currentChannel.listU[i].nick === rspQuitUser) {
						$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspQuitUser + " has leave the server, msg :" + rspQuitMess]);
						break;
					}
				}
				break;
			case "RMFILE":
				var rmFile = (/^:([\S]+)[ ]RMFILE[ ]([#][\S]+)[ ][:]([\S\w]+)$/).exec(msg);
				var fileUser = rmFile[1];
				var fileChan = rmFile[2];
				var fileToRm = rmFile[3];
				var fileName = in_isFile(fileToRm)[1];
				if(fileToRm !== "*"){
					if($scope.currentChannel.chan !== fileChan) {
						for(var i = 0; i<$scope.channels.length; i++) {
							for(var j = 0; j<$scope.channels[i].messages.length; j++) {
								if($scope.channels[i].messages[j][2].includes(fileToRm)) {
									$scope.channels[i].messages[j][2] = $scope.channels[i].messages[j][2].replace($scope.channels[i].messages[j][2], "<div class='messInBox'><p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>LinkDeleted<p></div>");
								}
								$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The file has been removed -> " + fileName + " by " + fileUser]);
							}
						}
					}
					else {
						for(var j = 0; j<$scope.currentChannel.messages.length; j++) {
							if($scope.currentChannel.messages[j][2].includes(fileToRm)) {
								$scope.currentChannel.messages[j][2] = $scope.currentChannel.messages[j][2].replace($scope.currentChannel.messages[j][2], "<div class='messInBox'><p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>LinkDeleted<p></div>")
							}
						}
						$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The file has been removed -> " + fileName + " by " + fileUser]);
					}
				}
				else {
					if($scope.currentChannel.chan !== fileChan) {
						for(var i = 0; i<$scope.channels.length; i++) {
							for(var j = 0; j<$scope.channels[i].messages.length; j++) {
								if($scope.channels[i].messages[j][2].includes(user.server + ":3001/")) {
									$scope.channels[i].messages[j][2] = $scope.channels[i].messages[j][2].replace($scope.channels[i].messages[j][2], "<div class='messInBox'><p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>LinkDeleted<p></div>");
								}
								$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "all files have been removed by " + fileUser]);
							}
						}
					}
					else {
						for(var j = 0; j<$scope.currentChannel.messages.length; j++) {
							if($scope.currentChannel.messages[j][2].includes(user.server + ":3001/")) {
								$scope.currentChannel.messages[j][2] = $scope.currentChannel.messages[j][2].replace($scope.currentChannel.messages[j][2], "<div class='messInBox'><p class='date'>" + new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + "</p><p>LinkDeleted<p></div>")
							}
						}
						$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "all files have been removed by " + fileUser]);
					}
				}
				break;
			case "LISTFILES":
				var rspListFiles = (/^[\w\S]+[ ]LISTFILES[ ]([#][\S\w]+)[ ]([\w\S]+)[ ]([\S]+)[ ]([\S]+)$/).exec(msg);
				var listFilesCh = rspListFiles[1];
				var listFilesURL = rspListFiles[2];
				var nameFiles = rspListFiles[3];
				var userFiles = rspListFiles[4];
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Channel :" + listFilesCh + " - user : " + userFiles + " - file : " + nameFiles + " " + listFilesURL]);
				break;
			case "341":
				var rspInvite = (/^[\w\S]+[ ]341[ ]([\S\w]+)[ ]([\w\S]+)$/).exec(msg);
				var rspInviteChan = rspInvite[2];
				var rspInviteUser = rspInvite[1];
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You have invited " + rspInviteUser + " on the channel " + rspInviteChan]);
				break;
			case "641":
				var rspInvited = (/^[\S\w]+[ ]641[ ]([\w\S]+)[ ]([\w\S]+)$/).exec(msg);
				var rspInvitedCh = rspInvited[2];
				var rspInvitedUser = rspInvited[1];
				if(user.mute.includes(rspInvitedUser) === false) {
					bootbox.confirm("You have been invited on the channel <strong>" + rspInvitedCh + "</strong> by <strong>" + rspInvitedUser + "</strong>, join now ?", function(ev){
						if(ev === true) {
							userInfo.socket.emit("message", "JOIN " + rspInvitedCh);
						}
						else {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You refused the invitation but you could join at every moment"]);
						}
						$scope.$apply();
					});
				}
				break;
			case "352":
				var rspWho = (/^:[0-9.a-z:]+[ ]352[ ][\w\S]+[ ]([\w\S]+)[ ][\w\S]+[ ][\w\W]+[ ][\w\S]+[ ]([\w\S]+)[ ]([\w\S]+)[ ][\w\S]+[ ]+([\w\S]+)$/).exec(msg);
				var rspChan = rspWho[1];
				var rspUserId = rspWho[2];
				var rspUserRight = rspWho[3];
				var rspUserRealN = rspWho[4];
				boolWho = true;
				if(rspUserRight.includes("H@")) {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "RealName : " + rspUserRealN + ", userId : " + rspUserId + " is an operator and is active on " + rspChan]);
				}
				else if(rspUserRight.includes("H+")) {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "RealName : " + rspUserRealN + ", userId : " + rspUserId + " is voice and is active on " + rspChan]);
				}
				else if(rspUserRight.includes("H")) {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "RealName : " + rspUserRealN + ", userId : " + rspUserId + " is active on " + rspChan]);
				}
				else if(rspUserRight.includes("G@")) {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "RealName : " + rspUserRealN + ", userId : " + rspUserId + " is an operator and is away on " + rspChan]);
				}
				else if(rspUserRight.includes("G+")) {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "RealName : " + rspUserRealN + ", userId : " + rspUserId + " is voice and is away on " + rspChan]);
				}
				else if(rspUserRight.includes("G")) {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "RealName : " + rspUserRealN + ", userId : " + rspUserId + " is gone on " + rspChan]);
				}
				break;
			case "315":
				if(boolWho === false) {
					$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "There is no such channel"]);
				}
				boolWho = false;
				break;
			case "353":
				var isNames = in_isNames(msg);
				var channelSet = isNames[2];
				var usersN = isNames[1];
				var mNames = "";
				var channelName = isNames[0];
				if(boolNames === false) { // refresh users list in every channels
					boolOnlyOneUser = false;
					if($scope.currentChannel.chan === channelName) {
						$scope.currentChannel.listU = usersN;
					}
					else {
						for(var i = 0; i<$scope.channels.length; i++) {
							if($scope.channels[i].chan === channelName) {
								$scope.channels[i].listU = usersN;
							}
						}
					}
					for(var i = 0; i<$scope.currentChannel.listU.length; i++) {
						if(admin.includes($scope.currentChannel.listU[i])) {
							$scope.currentChannel.listU[i].setRight(1);
						}
					}
					$scope.channels = isAdmin1(admin, $scope.channels);
				}
				else {
					for(var i = 0; i<usersN.length; i++) {
						if(usersN[i].right === 1) {
							mNames = "(Operateur) " + usersN[i].nick + ", " + mNames;
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
				break;
			case "366":
				if(boolOnlyOneUser === true) {
					for(var i = 0; i<$scope.channels.length; i++) {
						$scope.channels[i].removeUser(userInvisible);
					}
					$scope.currentChannel.removeUser(userInvisible);
				}
				break;
			case "324":
				if(msg.match(/^:[\S]+[ ]324[ ]MODE[ ][#][\S\w]+[ ][\w\S]+$/)) {
					var rspMode = (/^:[\S]+[ ]324[ ]MODE[ ]([#][\S\w]+)[ ]([\w\S]+)$/).exec(msg);
					var rspModeCh = rspMode[1];
					var rspModeFlag = rspMode[2];
					if(rspModeCh !== $scope.currentChannel.chan) {
						for(var i = 0; i<$scope.channels.length; i++) {
							if($scope.channels[i].chan === rspModeCh) {
								if(rspModeFlag === "+p") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is private"]);
								}
								else if(rspModeFlag === "-p") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is not private anymore"]);
								}
								else if(rspModeFlag === "-k") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " don't have a password anymore"]);
								}
								else if(rspModeFlag === "+s") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is now secret"]);
								}
								else if(rspModeFlag === "-s") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is not secret anymore"]);
								}
								else if(rspModeFlag === "+i") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is in invite-mode"]);
								}
								else if(rspModeFlag === "-i") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is not in invite mode anymore"]);
								}
								else if(rspModeFlag === "+t") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The topic of the channel " + rspModeCh + " is now available in modification only by operators"]);
								}
								else if(rspModeFlag === "-t") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Everyone could modify the topic of the channel " + rspModeCh]);
								}
								else if(rspModeFlag === "+n") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " could not receive message from away"]);
								}
								else if(rspModeFlag === "-n") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " could receive messsage from away"]);
								}
								else if(rspModeFlag === "+m") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is now moderate"]);
								}
								else if(rspModeFlag === "-m") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is not moderate anymore"]);
								}
							}
						}
					}
					else {
						if(rspModeFlag === "+p") {
						$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is private"]);
						}
						else if(rspModeFlag === "-p") {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is not private anymore"]);
						}
						else if(rspModeFlag === "-k") {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " don't have a password anymore"]);
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
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " is not moderate anymore"]);
						}
					}
				}
				else if(msg.match(/^:[0-9.a-z:]+[ ]324[ ]MODE[ ][#][\S\w]+[ ][\w\S]+[ ][\w\S]+$/)) {
					var rspMode = (/^:[0-9.a-z:]+[ ]324[ ]MODE[ ]([#][\S\w]+)[ ]([\w\S]+)[ ]([\w\S]+)$/).exec(msg);
					var rspModeCh = rspMode[1];
					var rspModeFlag = rspMode[2];
					var rspModeUser = rspMode[3];
					if(rspModeCh !== $scope.currentChannel.chan) {
						for(var i = 0; i<$scope.channels.length; i++) {
							if($scope.channels[i].chan === rspModeCh) {
								if(rspModeFlag === "+o") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " is now operator in " + rspModeCh]);
									boolNames = false;
									userInfo.socket.emit("message", "NAMES " + rspModeCh);
								}
								else if(rspModeFlag === "+k") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " have a password and the password is " + rspModeUser]);
								}
								else if(rspModeFlag === "-o") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " is now simple user in " + rspModeCh]);
									boolNames = false;
									userInfo.socket.emit("message", "NAMES " + rspModeCh);
								}
								else if(rspModeFlag === "+v") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " cound talk in the channel " + rspModeCh]);
								}
								else if(rspModeFlag === "-v") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " couldn't talk in the channel " + rspModeCh]);
								}
								else if(rspModeFlag === "+l") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The limit of users is  " + rspModeUser + " on " + rspModeCh]);
								}
								else if(rspModeFlag === "-l") {
									$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The limit of users is  " + rspModeUser + " on " + rspModeCh]);
								}
							}
						}
					}
					else {
						if(rspModeFlag === "+o") {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " is now operator in " + rspModeCh]);
							boolNames = false;
							userInfo.socket.emit("message", "NAMES " + rspModeCh);
						}
						else if(rspModeFlag === "+k") {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspModeCh + " have a password and the password is " + rspModeUser]);
						}
						else if(rspModeFlag === "-o") {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " is now simple user in " + rspModeCh]);
							boolNames = false;
							userInfo.socket.emit("message", "NAMES " + rspModeCh);
						}
						else if(rspModeFlag === "+v") {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " could talk in the channel " + rspModeCh]);
						}
						else if(rspModeFlag === "-v") {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " couldn't talk in the channel " + rspModeCh]);
						}
						else if(rspModeFlag === "+l") {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The limit of users is  " + rspModeUser + " on " + rspModeCh]);
						}
						else if(rspModeFlag === "-l") {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The limit of users is  " + rspModeUser + " on " + rspModeCh]);
						}
					}
				}
				else if(msg.match(/^:[0-9.a-z:]+[ ]324[ ]MODE[ ][#][\S\w]+[ ][\w\S]+[ ][\w\S]+[\S]+$/)) {
					var rspBan = (/^:[0-9.a-z:]+[ ]324[ ]MODE[ ]([#][\S\w]+)[ ]([\w\S]+)[ ]([\w\S]+)([\S]+)$/).exec(msg);
					var rspChanBan = rspBan[1];
					var rspModeBan = rspBan[2];
					var rspUserBan = rspBan[3];
					var rspTimeBan = rspBan[4];
					if(user.nick === rspUserBan) {
						if(rspModeFlag === "+b") {
							bootbox.alert("You have benn banned in the channel " + rspChanBan + " time : " + rspTimeBan);
						}
						else if(rspModeFlag === "-b") {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You are debanned from the channel " + rspChanBan]);
						}
						
					}
					else {
						if(rspModeFlag === "+b") {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " is now banned from " + rspModeCh]);
						}
						else if(rspModeFlag === "-b") {
							$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspModeUser + " coundn't join the " + rspModeCh]);
						}
					}
					boolNames = false;
					userInfo.socket.emit("message", "NAMES " + rspChanBan);
				}
				break;
			case "221":
				var rspModeUsers = (/^:[\S]+[ ]221[ ]MODE[ ]([\S]+)[ ]([\S]+)$/).exec(msg);
				var rspModeFlag = rspModeUsers[2];
				var rspModeUser = rspModeUsers[1];
				if(rspModeFlag === "+o") {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspModeUser + " is upgrade to admin in the server"]);
					for(var i = 0; i<$scope.channels.length; i++) {
						$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspModeUser + " is upgrade to admin in the server"]);
					}
					boolNames = false;
					userInfo.socket.emit("message", "NAMES");
				}
				else if(rspModeFlag === "-o") {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspModeUser + " is downgrade to simple user in the server"]);
					for(var i = 0; i<$scope.channels.length; i++) {
						$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspModeUser + " is downgrade to simple user in the server"]);
					}
					boolNames = false;
					userInfo.socket.emit("message", "NAMES");
				}
				else if(rspModeFlag === "+w") {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspModeUser + " received the WALLOPS"]);
				}
				else if(rspModeFlag === "-w") {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspModeUser + " doesn't received WALLOPS"]);
				}
				else if(rspModeFlag === "+s") {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspModeUser + " received the notification from server"]);
				}
				else if(rspModeFlag === "-s") {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspModeUser + "doesnt received notification from server"]);
				}
				else if(rspModeFlag === "+i") {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspModeUser + " is now invisible"]);
					for(var i = 0; i<$scope.channels.length; i++) {
						boolOnlyOneUser = true;
						userInvisible = rspModeUser;
						boolNames = false;
						userInfo.socket.emit("message", "NAMES " + $scope.channels[i].chan);
					}
				}
				else if(rspModeFlag === "-i") {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), rspModeUser + " is not invisible"]);
					boolNames = false;
					userInfo.socket.emit("message", "NAMES");
				}
				break;
			case "301":
				var rspAway = (/^[\S\w]+[ ]301[ ]([\S\w]+)[ ][:]([\W\w]+)$/).exec(msg);
				var rspAwayUser = rspAway[1];
				var rspAwayMsg = rspAway[2];
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The user " + rspAwayUser + " is away : " + rspAwayMsg]);
				break;
			case "305":
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You are not away anymore"]);
				$scope.$connected = true;
				break;
			case "306":
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You are away"]);
				$scope.$connected = false;
				break;
			case "372":
				var pandIRC = new User("PandIrcTeam");
				pandIRC.setRight(2);
				$scope.currentChannel.messages.push([pandIRC, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Welcome to the Pand'IRC Web Page"]);
				break;
			case "401":
				$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "This user isn't in the server or the channel doesn't exist"]);
				break;
			case "467":
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The key is already set"]);
				break;
			case "331":
				if(msg.match(/^:[0-9.a-z:]+[ ]331[ ]JOIN[ ][#][\w\S]+[ ][:][\w\S ]+$/)) {
					var cmdTopic = (/^:[0-9.a-z:]+[ ]331[ ]JOIN[ ]([#][\w\S]+)[ ][:]([\w\S ]+)$/).exec(msg);
					var channelTopic = cmdTopic[1];
					var messTopic = cmdTopic[2];
					$scope.currentChannel.setTopic(channelTopic + " : " + messTopic);
					$scope.topicChannel = $scope.currentChannel.topic;
				}
				if(msg.match(/^:[0-9.a-z:]+[ ]331[ ]TOPIC[ ][#][\w\S]+[ ][:][\w\S ]+$/)) {
					var cmdTopic = (/^:[0-9.a-z:]+[ ]331[ ]TOPIC[ ]([#][\w\S]+)[ ][:]([\w\S ]+)$/).exec(msg);
					var channelTopic = cmdTopic[1];
					var messTopic = cmdTopic[2];
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Channel -> " + channelTopic + " - Topic -> " + messTopic]);
				}
				break;
			case "332":
				var command = (/^:[0-9.a-z:]+[ ]332[ ]TOPIC[ ]([#][\w\S]+)[ ][:]([\w\S ]+)$/).exec(msg);
				var commandChannel = command[1];
				var commandMsg = command[2];
				
				for(var i = 0; i<$scope.channels.length; i++) {
					if($scope.channels[i].chan === commandChannel && $scope.channels[i].chan !== $scope.currentChannel.chan) {
						$scope.channels[i].setTopic = commandChannel + " : " + commandMsg;
						$scope.channels[i].messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Topic -> " + commandMsg]);
					}
				}
				if($scope.currentChannel.chan === commandChannel) {
					$scope.topicChannel = commandChannel + " : " + commandMsg;
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Topic -> " + commandMsg]);
				}
				break;
			case "322":
				boolList = true;
				var list = in_isList(msg);
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Channel : " + list[0] + " with " + list[1] + " user(s) - Topic ->" + list[2]]);
				break;
			case "323":
				if(boolList === false) {
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "There are no channels, create a channel with /join (use the button help is you re need information)"]);
				}
				boolList = false;
				break;
			case "311":
				var regXpTab = (/^:[\S]+[ ]311[ ]([\S\w]+)[ ]([\w\S]+)[ ][\S]+[ ][*][ ][:]([\w\S]+)$/).exec(msg);
				if(isCmdMute === true) {
					user.mute.push(regXpTab[1]);
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You have mute " + regXpTab[1]]);
				}
				else {
					if(regXpTab[2].includes("GUEST")===true) {
						$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Nickname : " + regXpTab[1] + " is a Guest"]);
					}
					else {
						$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Nickname : " + regXpTab[1] + " and his ID is " + regXpTab[2] + " - Realname : " + regXpTab[3]]);
					}
				}
				break;
			case "381":
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You are now an operator IRC"]);
				if(admin.includes(user.nick) === false) {
					admin.push(user.nick);
				}
				boolNames = false;
				userInfo.socket.emit("message", "NAMES");
				break;
			case "399":
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Your password have been update"]);
				break;
			case "403":
				$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "check if the channel is in invite mode or if the channel is valid"]);
				break;
			case "404":
				var rspMsg = (/^[\S]+[ ]404[ ]([#][\S\w]+)[ ][\w\W]+$/).exec(msg);
				var rspMsgCh = rspMsg[1];
				$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You couldn't talk in the channel " + rspMsgCh]);
				break;
			case "411":
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "No recipient give"]);
				break;
			case "431":
				$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Error with the nickname"]);
				break;
			case "433":
				$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "This nickname is already used"]);
				break;
			case "461":
				$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Not enough parameters RMFILE"]);
				break;
			case "462":
				$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You are not authorized to do this command (Guest)"]);
				break;
			case "464":
				bootbox.prompt("Password incorrect", function(ev){
					if(ev !== null) {
						userInfo.socket.emit("message", "PASS " + ev);
						userInfo.socket.emit("message", "USER " + user.userN + " 0 * :" + user.realName);
					}
					else {
						$window.location.href = landingUrl;
					}
					$scope.$apply();
				});
				break;
			case "475":
				var rspKeyWord = (/^[\S\w]+[ ]475[ ]([\w\W]+)\(\+k\)$/).exec(msg);
				var rspKeyChn = rspKeyWord[1];
				scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspKeyChn + " have a keyword"]);
				break;
			case "471":
				var rspLimitsUser = (/^[\w\S]+[ ]471[ ]([#][\w\S]+)[ ][\W\w]+\(\+l\)$/).exec(msg);
				var rspLimitsCh = rspLimitsUser[1];
				$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspChanI + " couldn't be join anymore (limits of user)"]);
				break;
			case "473":
				if(msg.match(/^[\w\S]+[ ]473[ ][#][\w\S]+[ ][\W\w]+\(\+i\)$/)) {
					var rspJoinI = (/^[\w\S]+[ ]473[ ]([#][\w\S]+)[ ][\W\w]+\(\+i\)$/).exec(msg);
					var rspChanI = rspJoinI[1];
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "The channel " + rspChanI + " could only be join if you're invited"]);
				}
				else if(msg.match(/^[\w\S]+[ ]473[ ][#][\w\S]+[ ][\W\w]+\(\+b\)$/)) {
					var rspJoinB = (/^[\w\S]+[ ]473[ ]([#][\w\S]+)[ ][\W\w]+\(\+b\)$/).exec(msg);
					var rspChanB = rspJoinB[1];
					$scope.currentChannel.messages.push([defaultMess, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You have been banned from " + rspChanI]);
				}
				break;
			case "481":
				$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "You are not IRC operator"]);
				break;
			case "482":
				$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "you are not operator in this channel or admin"]);
				break;
			case "501":
				$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "Unknown flag"]);
				break;
			case "502":
				$scope.currentChannel.messages.push([errorResponse, new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), "you must be admin or operator of the channel"]);
				break;
			case "2001":
				bootbox.alert("Cannot receive users");
				$window.location.href = landingUrl;
				break;
			case "2002":
				bootbox.alert("You're IP is too much used in the server");
				$window.location.href = landingUrl;
				break;
			case "2003":
				bootbox.alert("You have been banned from the server");
				$window.location.href = landingUrl;
				break;
			default:
		}
		if(msg.includes("PING")===true) {
			userInfo.socket.emit("message", "PONG");
		}
		$scope.currentChannel.messages.push([new User("debug"), new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), msg]);
		$scope.$apply();
    });
});
