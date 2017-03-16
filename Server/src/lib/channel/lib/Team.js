

class Team {
    constructor(game, id) {
        this.id = id;
        this.game = game;
        this._players = [];
        this._points = 0;

        this._take = false;
    }

    take() {
        this._take = true;
    }

    resetPoints() {
        this._points = 0;
        this._take = false;
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
            //player.send(':'+this.game.ip+' BELOTE '+this.game.name+' ERR :already in team');
            return false;
        }
        if(this.game.otherTeam(this).contains(player)) {
            this.game.otherTeam(this).removePlayer(player);
        }
        this._players.push(player);
        player.team = this;

        this.game.broadcast(':'+this.game.ip+' BELOTE '+this.game.name+' :'+player+' join team '+this.id);

        if(this.isFull() && this.game.otherTeam(this).isFull()) {
            this.game.teamArefull();
        }
        return true;
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