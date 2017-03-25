//operator
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

// admin
var isAdmin1 = function(listAdmin, channels) {
	for(var i = 0; i<channels.length; i++) {
		for(var j = 0; j<channels[i].listU.length; j++) {
			if(listAdmin.includes(channels[i].listU[j].nick)) {
				channels[i].listU[j].setRight(1);
			}
		}
	}
	return channels;
}