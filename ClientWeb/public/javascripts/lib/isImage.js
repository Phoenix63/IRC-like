var isImage = function(image) {
	var listExtension = ["jpeg", "jpg", "png"];
	var nameImage = image.split(".");
	var extension = nameImage[nameImage.length-1];
	if(listExtension.includes(extension)) {
		return true;
	}
	else {
		return false;
	}
}