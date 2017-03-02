
	var Whisper = (function() {
		function Whisper(chanName) {
			this.chan = chanName;
			this.listU = [];
			this.notif = 0;
			this.topic = "";
			this.messages = [];
			this.status = 1;
		}
		Whisper.prototype.setChan = function(chann) {
			this.chan = chann;
		}
		Whisper.prototype.removeUser = function(u) {
			var index = this.listU.indexOf(u);
			this.listU.splice(index,1);
		}
		Whisper.prototype.setNotifOn = function() {
			this.notif = 1;
		}
		Whisper.prototype.setNotifOff = function() {
			this.notif = 0;
		}
		Whisper.prototype.setNotifOffTemp = function() {
			this.notif = 2;
		}
		Whisper.prototype.setTopic = function(top) {
			this.topic = top;
		}
		return Whisper;
	})();