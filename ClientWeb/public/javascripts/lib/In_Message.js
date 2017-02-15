
	function in_isMsg(msg) {
		var msSplit = msg.split(' ');
		var sender = msSplit[0].replace(":","");
		var channel = msSplit[2];
		var mess = "";
		for(var i = 4; i<msSplit.length; i++) {
			mess = mess + " " + msSplit[i];
		}
		var msgBox = [sender, channel, mess];
		return msgBox;
	}
	function in_isNickname(msg) {
		var msSplit = msg.split(' ');
		var oldU = msSplit[0].replace(":","");
		var newU = msSplit[2];
		var lChangN = [oldU, newU];
		return lChangN;
	}
	
	function in_isNames(msg) {
		var msSplit = msg.split(' ');
		var listUsers = [];
		for(var i = 5; i<msSplit.length; i++) {
			listUsers.push(msSplit[i]);
		}
		return listUsers;
	}
	
	function in_isChannel(msg) {
		var msSplit = msg.split(' ');
		var nUser = msSplit[0].replace(":","");
		var channel = msSplit[2];
		var lChan = [nUser, channel];
		return lChan;
	}
