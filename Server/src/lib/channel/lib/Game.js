import config from './../../../config.json';
import Team from './Team';
import Deck from './Deck';
import Player from './Player';
import Round from './Round';

class Game {
    /**
     *
     * @param {Belote} belote
     */
    constructor(belote) {
        this._belote = belote;
        this.name = belote.name;
        this.ip = config.ip;
        this._round = null;
        this._deck = new Deck();
        this._players = [];

        /*
        * -1 : lobby
        * 0 : game
         */
        this._state = -1;

        this._teams = [new Team(this, 0), new Team(this, 1)];
    }

    get teams() {
        return this._teams;
    }

    set state(val) {
        if(val === 0) {
            this.broadcast(':'+config.ip+' BELOTE '+this.name+' :team selection');
        } else if(val === 1) {
            this.broadcast(':'+config.ip+' BELOTE '+this.name+' :game start');
            this.broadcast(':'+config.ip+' BELOTE '+this.name+' :team 0 '+this._teams[0].toString());
            this.broadcast(':'+config.ip+' BELOTE '+this.name+' :team 1 '+this._teams[1].toString());
        } else {
            val = -1;
        }
        this._state = val;
        console.log('state: '+val);
    }

    broadcast(message) {
        this._belote.broadcast(message, null);
    }

    get state() {
        return this._state;
    }

    teamArefull() {
        this.state = 1;
        this._round = new Round(this,
            [this.teams[0]._players[0], this.teams[1]._players[0],this.teams[0]._players[1],this.teams[1]._players[1]],
            this.teams[0],
            this.teams[1],
            this._deck,
            () => {
                let t1 = this.teams[0];
                let t2 = this.teams[1];
                let t1p = 0;
                let t2p = 0;

                if(t1.getPoints() < 1) {
                    t1p = t1.getBonus();
                    t2p = 252 + t2.getBonus();
                } else if (t2.getPoints() < 1) {
                    t2p = t1.getBonus();
                    t1p = 252 + t1.getBonus();
                } else if(t1._take && (t1.getPoints()+t1.getBonus() < t2.getPoints()+t2.getBonus())) {
                    t1p = t1.getBonus();
                    t2p = 162 + t2.getBonus();
                } else if(t2._take && (t1.getPoints()+t1.getBonus() > t2.getPoints()+t2.getBonus())) {
                    t2p = t2.getBonus();
                    t1p = 162 + t1.getBonus();
                } else {
                    t1p = t1.getPoints() + t1.getBonus();
                    t2p = t2.getPoints() + t2.getBonus();
                }
                this.broadcast(':'+this.ip+' BELOTE '+this.name+' :team points '+t1p+','+t2p);
            }
        );
    }

    /**
     *
     * @param {Client} client
     */
    addUser(client) {
        this._players.push(new Player(this, client));
        if(this._players.length === 4) {
            this.state = 0;
        }
    }

    removeUser(client) {
        this._players.forEach((player) => {
            player._team = null;
            if(player.client === client) {
                this._players.splice(this._players.indexOf(player), 1);
                this.state = -1;
                if(this._players.length === 3) {
                    this.broadcast(':'+this.ip+' BELOTE '+this.name+' :game reset');
                }
            }
        });
        this._round = null;
        this._deck = new Deck();
        this._teams = [new Team(this, 0), new Team(this, 1)];

    }

    userSelectTeam(client, teamId) {
        let team = parseInt(teamId);
        if(team === 0 || team === 1) {
            this.getPlayerFromClient(client, (player) => {
                if(player) {
                    this._teams[team].addPlayer(player);
                } else {
                    // le joueur n'est pas dans cette partie
                    client.socket.send(':'+config.ip+' BELOTE '+this.name+' ERR :you are not on this game');
                }
            });
        } else {
            // team invalide
            client.socket.send(':'+config.ip+' BELOTE '+this.name+' ERR :invalid teamid value');
        }
    }

    userTakeTrump(client, color) {
        color = parseInt(color);
        if([-1, 0,1,2,3].indexOf(color) >= 0) {
            this.getPlayerFromClient(client, (player) => {
                if(player) {
                    if(this._round.playerHaveToTake(player)) {
                        this._round.playerTakeTrump(player, color);
                    } else {
                        client.socket.send(':'+config.ip+' BELOTE '+this.name+' ERR :you cannot take, wait for other players');
                    }
                } else {
                    client.socket.send(':'+config.ip+' BELOTE '+this.name+' ERR :you are not on this game');
                }
            });
        } else {
            client.socket.send(':'+config.ip+' BELOTE '+this.name+' ERR :invalid color value');
        }
    }

    userPlayCard(client, card) {
        if(this._round) {
            this.getPlayerFromClient(client, (player) => {
                this._round.playerPlayCard(player, parseInt(card));
            });
        } else {
            console.log('la partie n a pas commencé');
        }
    }

    getPlayerFromClient(client, callback=function(){}) {
        this._players.forEach((player) => {
            if(player.client === client) {
                callback(player);
                return null;
            }
        });
    }

    otherTeam(team) {
        if(this._teams.indexOf(team) === 0)
            return this._teams[1];
        return this._teams[0];
    }
}

export default Game