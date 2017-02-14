function Channel(chanName, admin, listUser) {
    this.chan = chanName;
    this.admi = admin;
    this.listU = listUser || [admin];
}
Channel.prototype.setAdmin = function(newAdmin) {
    this.admi = newAdmin;
};
Channel.prototype.addUser = function(newUser) {
    this.listU.push(newUser);
};
Channel.prototype.removeUser = function(u) {
    var index = this.listU.indexOf(u);
    this.listU.splice(index,1);
};


