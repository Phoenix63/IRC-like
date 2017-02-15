	var Channel = (function() {
		function Channel(chanName, admin, listUser, messages) {
			this.chan = chanName;
			this.admi = admin;
			this.listU = listUser || [admin];
			this.messages = messages || [];
		}
		Channel.prototype.setAdmin = function(newAdmin) {
			this.admi = newAdmin;
		}
		Channel.prototype.addUser = function(newUser) {
			this.listU.push(newUser);
		}
		Channel.prototype.addMessages = function(newMess) {
			this.messages.push(newMess);
		}
		Channel.prototype.removeUser = function(u) {
			var index = this.listU.indexOf(u);
			this.listU.splice(index,1);
		}
		return Channel;
	})();