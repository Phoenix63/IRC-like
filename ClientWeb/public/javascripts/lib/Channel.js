	var Channel = (function() {
		function Channel(chanName) {
			this.chan = chanName;
			this.admi = undefined;
			this.notif = 0;
			this.status = 0;
			this.listU = [];
			this.admin = [];
			this.mute = [];
			this.topic = "";
			this.messages = [];
			this.usersMessages = [];
		}
		Channel.prototype.setAdmin = function(newAdmin) {
			this.admi = newAdmin;
		}
		Channel.prototype.addUser = function(newUser) {
			this.listU.push(newUser);
		}
		Channel.prototype.removeUser = function(u) {
			for(var i = 0; i<this.listU.length; i++) {
				if(this.listU[i].nick === u) {
					this.listU.splice(i,1);
				}
			}
		}
		Channel.prototype.removeMuteList = function(user) {
			for(var i = 0; i<this.mute.length; i++) {
				if(this.mute[i] === user) {
					this.mute.splice(i,1);
				}
			}
		}
		Channel.prototype.isInChannel = function(user) {
			for(var i = 0; i<this.listU.length; i++) {
				if(this.listU[i].nick === user) {
					return true;
				}
			}
			return false;
		}
		Channel.prototype.setNickInList = function(oldNick, newNick) {
			for(var i = 0; i<this.listU.length; i++) {
				if(this.listU[i].nick === oldNick) {
					this.listU[i].setNick(newNick); 
				}
			}
		}
		Channel.prototype.addMessages = function(user, newMessage) {
			this.usersMessages.push(user);
			this.messages.push(newMess);
		}
		Channel.prototype.deleteMessages = function(delMess) {
			var index = this.messages.indexOf(delMess);
			this.messages.splice(index,1);
		}
		Channel.prototype.setNotifOn = function() {
			this.notif = 1;
		}
		Channel.prototype.setNotifOff = function() {
			this.notif = 0;
		}
		Channel.prototype.setNotifOffTemp = function() {
			this.notif = 2;
		}
		Channel.prototype.setTopic = function(top) {
			this.topic = top;
		}
		
		return Channel;
	})();