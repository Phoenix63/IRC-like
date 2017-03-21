
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
		var channSet = msSplit[3];
		var chann = msSplit[4];
		for(var i = 5; i<msSplit.length; i++) {
			msSplit[i] = msSplit[i].replace(":","");
			if(msSplit[i].includes("@")) {
				msSplit[i] = msSplit[i].replace("@","");
				var newUser = new User(msSplit[i]);
				newUser.setRight(1);
				listUsers.push(newUser);
			}
			else {
				var newUser = new User(msSplit[i]);
				listUsers.push(newUser);
			}
		}
		return [chann, listUsers, channSet];
	}
	
	function in_isChannel(msg) {
		var msSplit = msg.split(' ');
		msSplit[0] = msSplit[0].replace(":","");
		var channel = msSplit[2];
		var lChan = [msSplit[0], channel];
		return lChan;
	}
	
	function in_isTopic(msg) {
		var msSplit = msg.split(' ');
		var channel = msSplit[3];
		var topic = "";
		msSplit[4] = msSplit[4].replace(":","");
		for(var i = 4; i<msSplit.length; i++) {
			topic = topic + " " + msSplit[i];
		}
		return [channel, topic];
	}
	function in_isList(msg) {
		var msSplit = msg.split(' ');
		var channel = msSplit[3];
		var numberOfUser = msSplit[4];
		var topic = "";
		msSplit[5] = msSplit[5].replace(":","");
		for(var i = 5; i<msSplit.length; i++) {
			topic = topic + " " + msSplit[i];
		}
		return [channel, numberOfUser, topic];
	}
	
