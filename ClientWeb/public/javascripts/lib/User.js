var User = (function() {
		function User(userName, realName, channels) {
			var uniqid = function() {
				return (new Date().getTime() + Math.floor((Math.random()*10000)+1)).toString(16);
			};	
			this.userN = userName || ("Guest_" + uniqid());
			this.nick = userName || ("Guest_" + uniqid());
			this.realName = realName || "Guest";
		}
		User.prototype.setNick = function(newNick) {
			this.userN = newNick;
		}
		return User;
	})();
