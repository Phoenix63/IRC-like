import config from './../../../config.json';
import Team from './Team';
import Deck from './Deck';
import Player from './Player';

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
        } else if(val === -1 && this._round) {
            this._round = null;
            this.broadcast(':'+config.ip+' BELOTE '+this.name+' :back to lobby');
        } else {
            this.broadcast(':'+config.ip+' BELOTE '+this.name+' :game start');
            this.broadcast(':'+config.ip+' BELOTE '+this.name+' :team 0 '+this._teams[0].toString());
            this.broadcast(':'+config.ip+' BELOTE '+this.name+' :team 1 '+this._teams[1].toString());
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
            [this.teams[0]._players[0], this.teams[0]._players[1],this.teams[1]._players[0],this.teams[1]._players[1]],
            this.teams[0],
            this.teams[1],
            this._deck,
            function() {
                // end of the round
                console.log('end of round');
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
            if(player.client === client) {
                this._players = this._players.slice(this._players.indexOf(player), 1);
                this.state = -1;
            }
        });
    }
}

export default Game