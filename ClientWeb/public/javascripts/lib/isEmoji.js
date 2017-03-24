var changeToEmoji = function(str) {
	if(str.match(/^[\w\W]*[:][\S]+[:][\w\W]*$/)) {
		var listValid = ["4Head", "10E", "100", "AH", "alien", "ANELE", "avocat", "BabyRage", "BasedGod", "BibleThump", "burger", "canard", "carreau", "chicken", "chicken_leg", "clap", "coeur", "concernDoge", "CoolCat", "CoolStoryBob", "cry", "DansGame", "EleGiggle", "FailFish", "faker", "feelsBadMan", "FeelsBirthdayMan", "FeelsGoodMan", "FrankerZ", "GabeN", "heart_eyes", "HeyGuys", "joie", "kamel27", "kamelSKURT", "Kappa", "KappaHD", "KappaPride", "KappaRoss", "Keepo", "kinge", "KKona", "KreyGasm", "lirikREKT", "lirikThump", "LUL", "malaise", "MingLee", "monkey", "no_exp", "NotLikeThis", "ok_hand", "pandab", "PedoBear", "pique", "pizza", "PJSalt", "PogChamp", "puke", "ResidentSleeper", "smile", "sMOrc", "stack", "sunglasses", "surprised", "sweat_smile", "SwiftRage", "TheIlluminati", "TheThing", "thugfiddleBonobo", "thugfiddleBonobro", "tong_close", "tong_wink", "trefle", "triHard", "TTours", "VoHiYo", "WutFace", "x_x", "zrtAient", "zzz"];
		var listPossEmoji = str.match(/[:][\S]+[:]/g);
		for(var i = 0; i<listPossEmoji.length; i++) {
			var nameF = listPossEmoji[i];
			while (nameF.indexOf(":") !== -1) {
				nameF = nameF.replace(":", "");
			}
			listPossEmoji[i] = nameF;
		}
		for(var i = 0; i<listPossEmoji.length; i++) {
			if(listValid.includes(listPossEmoji[i]) === false) {
				listPossEmoji.splice(i, 1);
			}
		}
		if(listPossEmoji.length === 0) {
			return false;
		}
		else {
			for(var i = 0; i<listPossEmoji.length; i++) {
				while (str.indexOf(":" + listPossEmoji[i] + ":") !== -1) {
					str = str.replace(":" + listPossEmoji[i] + ":", "<img class='emote' src='../../images/" + listPossEmoji[i] + ".png' />");
				}
			}
			return str;
		}
	}
	else {
		return false;
	}
}