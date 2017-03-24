var miniature = function(width, heigth) {
	if(width > heigth) {
		if(width > 400) {
			var per = width / 100;
			width = width / per;
			heigth = heigth / per;
		}
	}
	else if(heigth > width){
		if(heigth > 400) {
			var per = heigth / 100;
			width = width / per;
			heigth = heigth / per;
		}
	}
	else {
		if(width > 400) {
			width = width / (width / 100);
			heigth = heigth / (heigth / 100);
		}

	}
	return [width, heigth];
}