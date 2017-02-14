myApp.controller("ircCtrl",function($scope) {

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
                        $scope.newMessage = undefined;
                        $scope.$apply();
                        break;
                    case "/nick":
                        socket.emit("message", "NICK" + string);
                        socket.emit("message","USER" + string + " 0 * :" + string);
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
                        //users in the channel
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
                        break;
                }
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


        });
    });

