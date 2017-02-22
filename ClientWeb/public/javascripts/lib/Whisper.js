
	var Whisper = (function() {
		function Whisper(chanName) {
			this.chan = chanName;
			this.listU = [];
			this.messages = [];
			this.status = 1;
		}
		Whisper.prototype.removeUser = function(u) {
			var index = this.listU.indexOf(u);
			this.listU.splice(index,1);
		}
		return Whisper;
	})();