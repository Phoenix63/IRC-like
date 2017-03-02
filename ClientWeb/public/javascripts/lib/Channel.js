	var Channel = (function() {
		function Channel(chanName) {
			this.chan = chanName;
			this.admi = undefined;
			this.notif = 0;
			this.status = 0;
			this.listU = [];
			this.topic = "";
			this.messages = [];
		}
		Channel.prototype.setAdmin = function(newAdmin) {
			this.admi = newAdmin;
		}
		Channel.prototype.addUser = function(newUser) {
			this.listU.push(newUser);
		}
		Channel.prototype.removeUser = function(u) {
			var index = this.listU.indexOf(u);
			this.listU.splice(index,1);
		}
		Channel.prototype.addMessages = function(newMess) {
			this.messages.push(newMess);
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