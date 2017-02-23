
	var Whisper = (function() {
		function Whisper(chanName) {
			this.chan = chanName;
			this.listU = [];
			this.notif = 0;
			this.messages = [];
			this.status = 1;
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
		return Whisper;
	})();