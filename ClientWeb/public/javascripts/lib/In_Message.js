
	function in_isMsg(msg) {
		var msSplit = msg.split(' ');
		msSplit[0] = msSplit[0].replace(":","");
		var channel = msSplit[2];
		var mess = "";
		for(var i = 4; i<msSplit.length; i++) {
			mess = mess + " " + msSplit[i];
		}
		var msgBox = [msSplit[0], channel, mess];
		return msgBox;
	}
	function in_isNickname(msg) {
		var msSplit = msg.split(' ');
		msSplit[0] = msSplit[0].replace(":","");
		var newU = msSplit[2];
		var lChangN = [msSplit[0], newU];
		return lChangN;
	}
	
	function in_isNames(msg) {
		var msSplit = msg.split(' ');
		var listUsers = [];
		var chann = msSplit[4];
		msSplit[5] = msSplit[5].replace(":@","");
		listUsers.push(msSplit[5]);
		for(var i = 6; i<msSplit.length; i++) {
			listUsers.push(msSplit[i]);
		}
		return [chann, listUsers];
	}
	
	function in_isChannel(msg) {
		var msSplit = msg.split(' ');
		msSplit[0] = msSplit[0].replace(":","");
		var channel = msSplit[2];
		var lChan = [msSplit[0], channel];
		return lChan;
	}
