var User = (function() {
		function User(userName) {
			var uniqid = function() {
				return (new Date().getTime() + Math.floor((Math.random()*10000)+1)).toString(16);
			};	
			this.userN = userName || (uniqid());
			this.nick = userName || "";
			this.realName = "Guest";
			this.right = 0;
		}
		User.prototype.setNick = function(newNick) {
			this.nick = newNick;
		};
		User.prototype.setRight = function(newRight) {
			this.right = newRight;
		};
		return User;
	})();
