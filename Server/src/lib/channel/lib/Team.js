

class Team {
    constructor(game, id) {
        this.id = id;
        this.game = game;
        this._players = [];
        this._points = 0;

        this._take = false;
        this._br = false;
    }

    take() {
        this._take = true;
    }

    resetTake() {
        this._take = false;
    }

    isTaker() {
        return this._take;
    }

    setBr() {
        this._br = true;
    }

    getBonus() {
        if(this._br)
            return 20;
        return 0;
    }

    resetPoints() {
        this._points = 0;
        this._take = false;
        this._br = false;
    }

    addPoints(val) {
        this._points += val;
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
            this.game.rpl.ERR_TEAMISFULL(player.client.socket);
            return false;
        }
        if(this.contains(player)) {
            // already in team (catched by game)
            return false;
        }
        if(this.game.otherTeam(this).contains(player)) {
            this.game.otherTeam(this).removePlayer(player);
        }
        this._players.push(player);
        player.team = this;

        this.game.rpl.teamJoin(player, this.id);

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