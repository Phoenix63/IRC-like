var isAdmin = function (user, channel) {
	for(var i = 0; i<channel.listU.length; i++) {
		if(channel.listU[i].nick === user.nick) {
			if(channel.listU[i].right === 1) {
				user.setRight(1);
				return user;
			}
		}
	}
	return user;
}