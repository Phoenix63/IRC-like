
class Round {
    /**
     * cb is returned at the end of the round
     * @param {Game} game
     * @param {Array<Player>} order
     * @param {Team} team1
     * @param {Team} team2
     * @param {Deck} deck
     * @param {Function} cb
     */
    constructor(game, order, team1, team2, deck, cb) {
        this.game = game;
        this._players = order;
        this._teams = [team1, team2];
        this._deck = deck;
        this._endCallback = cb;

        this._deck.reset();

        this._trump = null;
        this._takeTurn = -1;
        this._play = 0;

        this._players.forEach((player) => {
            player.send(':'+this.game.ip+' BELOTE '+this.game.name+' :round start '+this._players.join(','));
        });
        this._giveCards();
    }

    isPlayerTurn(player) {
        return (this._play === this._players.indexOf(player));
    }

    playerHaveToTake(player) {
        return ((this._takeTurn >= 0) && this.isPlayerTurn(player));
    }

    _end() {
        this._endCallback();
    }

    _giveCards() {
        for(let i=0; i<4; i++) {
            this._players[i].addCardToHand(this._deck.getCards(3));
        }
        for(let i=0; i<4; i++) {
            this._players[i].addCardToHand(this._deck.getCards(2));
        }
        this._showTrump();
    }

    _showTrump() {
        this._trump = this._deck.getCards(1)[0];
        this._takeTurn = 0;
        this._play = 0;
        this.game.broadcast(':'+this.game.ip+' BELOTE '+this.game.name+' :donald is '+this._trump);
        this._notifPlayerToTake();
    }

    _notifPlayerToTake() {
        this._players[this._play].client.socket.send(':'+this.game.ip+' BELOTE '+this.game.name+' :do you take '+this._trump+' (turn '+this._takeTurn+')');
    }

    playerTakeTrump(player, colors) {
        let index = this._players.indexOf(player);
        if(colors < 0) {
            this._play++;
            if(this._play > 4) {
                this._play = 0;
                this._takeTurn++;
                if(this._takeTurn > 1) {
                    this._takeTurn = 1;
                    this._play = 3;
                    this._players[this._play].client.socket.send(':'+this.game.ip+' BELOTE '+this.game.name+' ERR :you have to take... you are the cow!');
                }
            }
            this._notifPlayerToTake();
        } else if(index >= 0 && this._trump) {
            if(this._takeTurn === 0 && colors === this._trump.color || this._takeTurn === 1 && colors !== this._trump.color) {
                this._players[index].addCardToHand([this._trump]);

                player.team.take();
                this.game.broadcast(':'+this.game.ip+' BELOTE '+this.game.name+' :player '+this._play+' take '+this._trump.value+' color is '+colors);

                for(let i = 0 ; i<4; i++) {
                    this._players[i].addCardToHand(this._deck.getCards((i === index ? 2 : 3)));
                }
                this._trump = null;
                this._gameStart();

            } else {
                this._players[this._play].client.socket.send(':'+this.game.ip+' BELOTE '+this.game.name+' ERR :you cannot take this card (wrong color)');
            }
        } else {
            this._players[this._play].client.socket.send(':'+this.game.ip+' BELOTE '+this.game.name+' ERR :you are not on this game');
        }
    }

    _gameStart() {
        this._takeTurn = -1;
        this._play = 0;
    }
}

export default Round