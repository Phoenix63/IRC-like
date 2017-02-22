function out_isMsg(msg) {
	var msSplit = msg.split(' ');
	var msToSend = "";
	for(var i = 2; i<msSplit.length; i++) {
		msToSend = msToSend + " " + msSplit[i];
	}
	return msToSend;
}