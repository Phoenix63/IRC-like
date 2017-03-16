

class Team {
    constructor(game, id) {
        this.id = id;
        this.game = game;
        this._players = [];
        this._points = 0;
    }

    resetPoints() {
        this._points = 0;
    }

    addPoints(val) {
        this._points = val;
    }

    getPoints() {
        return this._points;
    }

    /**
     * return false if team is full/player already in team or true if player join the team
     * it auto update player team
     * @param {Player} player
     * @return {boolean}
     */
    addPlayer(player) {
        if(this.isFull()) {
            player.send(':'+this.game.ip+' BELOTE '+this.game.name+' ERR :team is full');
            return false;
        }
        if(this.contains(player)) {
            player.send(':'+this.game.ip+' BELOTE '+this.game.name+' ERR :already in team');
            return false;
        }
        if(this.game.teams[this.game.indexOf(this+1)%2].contains(player)) {
            this.game.teams[this.game.indexOf(this+1)%2].removePlayer(player);
        }
        this._players.add(player);
        player.team = this;

        this.game.broadcast(':'+this.game.ip+' BELOTE '+this.game.name+' :'+player+' join team '+this.id);

        if(this.isFull() && this.game.teams[this.game.indexOf(this+1)%2].isFull()) {
            this.game.teamArefull();
        }
        return true;
    }

    removePlayer(player) {
        this.game.broadcast(':'+this.game.ip+' BELOTE '+this.game.name+' :'+player+' leave team '+this.id);
    }

    isFull() {
        return this._players.length >= 2;
    }

    /**
     *
     * @param {Player} player
     * @return {boolean}
     */
    contains(player) {
        return (this._players.indexOf(player) >= 0);
    }

    get players() {
        return this._players;
    }

    toString() {
        return this._players.join(',');
    }
}

export default Team