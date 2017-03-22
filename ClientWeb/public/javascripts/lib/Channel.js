	var Channel = (function() {
		function Channel(chanName) {
			this.chan = chanName;
			this.notif = 0;
			this.status = 0;
			this.listU = [];
			this.topic = "";
			this.messages = [];
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