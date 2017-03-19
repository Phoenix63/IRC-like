const debug = require('debug')('pandirc:belote:Round');

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
        this._trumpColor = -1;
        this._takeTurn = -1;
        this._play = 0;

        this._folds = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];
        
        this._currentFold = 0;

        this.game.rpl.roundStart(this._players.join(','));
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
        this._trumpColor = -1;
        this._trump = this._deck.getCards(1)[0];
        this._trumpColor = this._trump.color;
        this._takeTurn = 0;
        this._play = 0;
        this.game.rpl.trumpIs(this._trump);
        this._notifyPlayerToTake();
    }

    _notifyPlayerToTake() {
        this.game.rpl.playerHaveToTake(this._players[this._play], this._trump, this._takeTurn);
    }

    playerTakeTrump(player, colors) {
        let index = this._players.indexOf(player);
        if(!this._players[0].team._take && !this._players[1].team._take) {
            if(colors < 0) {
                let isNext = true;

                this._play++;
                if(this._play >= 4) {
                    this._play = 0;
                    this._takeTurn++;
                    if(this._takeTurn > 1) {
                        isNext = false;
                        this._takeTurn = 1;
                        this._play = 3;
                        this.game.rpl.ERR_PLAYERISCOW(this._players[this._play].client.socket);
                    }
                }
                if(isNext) {
                    this.game.rpl.playerDoNotTake();
                }
                this._notifyPlayerToTake();
            } else if(index >= 0 && this._trump) {
                if(this._takeTurn === 0 && colors === this._trumpColor || this._takeTurn === 1 && colors !== this._trumpColor) {
                    this._players[index].addCardToHand([this._trump]);

                    player.team.take();

                    this._trumpColor = colors;

                    this.game.rpl.playerTake(this._play, this._trump, this._trumpColor);

                    for(let i = 0 ; i<4; i++) {
                        this._players[i].addCardToHand(this._deck.getCards((i === index ? 2 : 3)));
                    }
                    this._gameStart();

                } else {
                    this.game.rpl.ERR_WRONGCOLOR(this._players[this._play].client.socket);
                }
            } else {
                this.game.rpl.ERR_NOTINGAME(this._players[this._play].client.socket);
            }
        } else {
            // l'atout est deja choisis
        }

    }

    _gameStart() {
        this._takeTurn = -1;
        this._play = 0;
        this._players.forEach((player) => {
            debug('--------- '+player.client.name+' ----------');
            debug(player._hand.map((c) => {
                return c.toString(true, this._trumpColor);
            }).join('\t| '));
        });

        this._notifyToPlay();
    }

    _notifyToPlay() {
        this.game.rpl.playerTurn(this._players[this._play], this._players[this._play].getPlayableCard(this._trump, this._trumpColor, this._folds[this._currentFold]).playable.join(','));
    }

    playerPlayCard(player, card) {
        if(this.game.isTrumpTaken()) {
            if(this._play === this._players.indexOf(player)) {
                player._hand.forEach((c) => {
                    if(c.value === card) {
                        card = c;
                    }
                });

                if(player._hand.indexOf(card) >= 0) {
                    let cds = player.getPlayableCard(this._trump, this._trumpColor, this._folds[this._currentFold]);
                    let play = cds.playable;
                    let masterCardOwner = cds.master.player;
                    let masterCard = cds.master.card;

                    if(play.indexOf(card) >= 0) {

                        if(!masterCard || card.compare(masterCard, this._folds[this._currentFold][0][1].color, this._trumpColor)>0) {
                            masterCard = card;
                            masterCardOwner = player;
                        }


                        let end = false;
                        this._folds[this._currentFold].push([player, card]);

                        this._deck._played.push(card);

                        this.game.rpl.playerPlay(this._play, card);
                        player.play(card.value);
                        this._play++;
                        if(this._play >= 4) {
                            this._play = 0;
                        }

                        debug('----------------- pli ('+this._trumpColor+') ------------');
                        debug(this._folds[this._currentFold].map((c) => {
                            if(c[1] === masterCard)
                                return '*'+c[1].toString(true, this._trumpColor);
                            return c[1].toString(true, this._trumpColor);
                        }).join('\t| '));
                        console.log();

                        if(this._folds[this._currentFold].length >= 4) {
                            this._players.forEach((player) => {
                                debug('--------- '+player.client.name+' ----------');
                                debug(player._hand.map((c) => {
                                    return c.toString(true, this._trumpColor);
                                }).join('\t| '));
                            });

                            this._currentFold++;
                            if(this._currentFold >= 8) {
                                end = true;
                            } else {
                                this._play = this._players.indexOf(masterCardOwner);
                            }
                            this.game.rpl.endOfFold(this._folds[this._currentFold-1].map((f) => {
                                return f[1];
                            }).join(','));
                            this._folds[this._currentFold-1].forEach((pc) => {
                                masterCardOwner.team.addPoints(pc[1].getPoints(this._trumpColor));
                            });
                            if(this._currentFold === this._folds.length-1) {
                                masterCardOwner.team.addPoints(10);
                            }

                        }
                        if(!end) {
                            this._notifyToPlay();
                        } else {
                            this.game.rpl.roundEnd();
                            this._endCallback();
                        }
                    } else {
                        this.game.rpl.ERR_INVALIDCARD(player.client.socket);
                    }
                } else {
                    this.game.rpl.ERR_PLAYERDONOTHAVECARD(player.client.socket);
                }

            } else {
                this.game.rpl.ERR_NOTYOURTURN(player.client.socket);
            }
        } else {
            // l'atout n'est pas choisis
            debug('atout pas choisis');
        }

    }
}

export default Round