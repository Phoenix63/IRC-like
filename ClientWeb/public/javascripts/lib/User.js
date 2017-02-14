function User(userName, realName, channels) {
    var uniqid = function() {
        return (new Date().getTime() + Math.floor((Math.random()*10000)+1)).toString(16);
    };
    this.userN = userName || ("Guest_" + uniqid());
    this.realName = realName || "Guest";
    this.chan = channels || [];
}
User.prototype.addChannel = function(ch) {
    this.chan.push(ch);
};
User.prototype.setNick = function(newNick) {
    this.userN = newNick;
};
User.prototype.removeChannel = function(c) {
    var index = this.chan.indexOf(c);
    this.chan.splice(index,1);
};

