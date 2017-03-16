
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

        this._atout = null;
        this._takeTurn = -1;

        this._players.forEach((player) => {
            player.send(':'+this.game.ip+' BELOTE '+this.game.name+' :round start '+this._players.join(','));
        });
        this._giveCards();
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
        this._showAtout();
    }

    _showAtout() {
        this._atout = this._deck.getCards(1)[0];
        this._takeTurn = 0;
    }

    playerTakeAtout(player, colors) {
        let index = this._players.indexOf(player);
        if(index >= 0 && this._atout) {
            if(this._takeTurn === 0 && colors === this._atout.color || this._takeTurn === 1 && colors !== this._atout.color) {
                this._players[index].addCardToHand([this._atout]);
                this._atout = null;
                this._takeTurn = -1;

                for(let i = 0 ; i<4; i++) {
                    this._players[i].addCardToHand(this._deck.getCards((i === index ? 2 : 3)));
                }

                this._gameStart();

            } else {
                // le joueur n'a pas le droit de prendre à cette couleur
            }
        } else {
            // le joueur n'est pas dans la partie
        }
    }

    _gameStart() {
        console.log('game start');
    }
}