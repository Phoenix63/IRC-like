const debug = require('debug')('belote:Round');

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
        if(!this._players[0].team._take && !this._players[1].team._take) {
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
                    this._gameStart();

                } else {
                    this._players[this._play].client.socket.send(':'+this.game.ip+' BELOTE '+this.game.name+' ERR :you cannot take this card (wrong color)');
                }
            } else {
                this._players[this._play].client.socket.send(':'+this.game.ip+' BELOTE '+this.game.name+' ERR :you are not on this game');
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
                return c.toString(true, this._trump.color);
            }).join('\t| '));
        });

        this._notifToPlay();
    }

    _notifToPlay() {
        this._players[this._play].client.socket.send(':'+this.game.ip+' BELOTE '+this.game.name+' :that is your turn');
    }

    playerPlayCard(player, card) {
        if(this._players[0].team._take || this._players[1].team._take) {
            if(this._play === this._players.indexOf(player)) {
                player._hand.forEach((c) => {
                    if(c.value === card) {
                        card = c;
                    }
                });

                // verifier que le joueur a la carte
                if(player._hand.indexOf(card) >= 0) {
                    let masterCardOwner = null;
                    let play = false;
                    if(this._folds[this._currentFold].length > 0) {
                        let firstCard = this._folds[this._currentFold][0][1];
                        let firstCardOwner = this._folds[this._currentFold][0][0];
                        let playercards = player.getCardByColors([firstCard.color]);
                        let playertrumps = player.getCardByColors([this._trump.color]);
                        let masterCard = firstCard;
                        masterCardOwner = firstCardOwner;
                        let pcards = [];

                        this._folds[this._currentFold].forEach((arr) => {
                            if(arr[1].compare(masterCard, masterCard.color, this._trump.color)>0) {
                                masterCard = arr[1];
                                masterCardOwner = arr[0];
                            }

                        });

                        if(masterCard.color !== this._trump.color && masterCard.color === firstCard.color) {
                            debug('pli normal');
                            playertrumps.map((trump) => {
                                pcards.push(trump);
                            });
                            playercards.map((c) => {
                                pcards.push(c);
                            })
                            if(pcards.length === 0) {
                                player._hand.map((c)=> {
                                    pcards.push(c);
                                })
                                debug('ne peut pas couper ni jouer à la couleur');
                            } else {
                                debug('peut couper ou jouer à la couleur');
                            }
                        } else {
                            if(masterCard.color !== firstCard.color) {
                                debug('le pli est coupé');

                                if(player.team.contains(masterCardOwner)) {
                                    debug('le coéquipié est maitre');

                                    playercards.map((c) => {
                                        pcards.push(c);
                                    });

                                    if(pcards.length === 0) {
                                        debug('ne peut pas fournir la couleur');
                                        player._hand.map((c) => {
                                            pcards.push(c);
                                        });
                                    }
                                } else {
                                    debug('le coequipié n est pas maitre');

                                    playercards.map((c) => {
                                        pcards.push(c);
                                    })
                                    if(pcards.length === 0) {
                                        debug('ne peut pas jouer à la couleur');
                                        playertrumps.map((trump) => {
                                            if(trump.compare(masterCard, masterCard.color, this._trump.color)>0)
                                                pcards.push(trump);
                                        });
                                        if(pcards.length === 0) {
                                            debug('ne peut pas monter à l atout');
                                            playertrumps.map((trump) => {
                                                pcards.push(trump);
                                            });
                                            if(pcards.length === 0) {
                                                debug('ne peut pas pisser');
                                                player._hand.map((c)=> {
                                                    pcards.push(c);
                                                })
                                            }
                                        }
                                    }
                                }


                            } else {
                                debug('pli à l atout');
                                playertrumps.map((trump) => {
                                    if(trump.compare(masterCard, masterCard.color, this._trump.color)>0)
                                        pcards.push(trump);
                                });
                                if(pcards.length === 0) {
                                    debug('ne peut pas monter à l atout');
                                    playertrumps.map((trump) => {
                                        pcards.push(trump);
                                    });
                                    if(pcards.length === 0) {
                                        debug('ne peut pas pisser');
                                        player._hand.map((c)=> {
                                            pcards.push(c);
                                        })
                                    }
                                }
                            }

                        }

                        debug('--------- '+player.client.name+' ----------');
                        debug(player._hand.map((c) => {
                            return c.toString(true, this._trump.color);
                        }).join('\t| '));
                        debug('- peut jouer -');
                        debug(pcards.map((c) => {
                            return c.toString(true, this._trump.color);
                        }).join('\t| '));

                        if(pcards.indexOf(card) >= 0) {
                            play = true;
                        }


                    } else {
                        play = true;
                    }


                    if(play) {
                        let end = false;
                        this._folds[this._currentFold].push([player, card]);
                        debug('----------------- pli ------------');
                        debug(this._folds[this._currentFold].map((c) => {
                            return c[1].toString(true, this._trump.color);
                        }).join('\t| '));
                        this.game.broadcast(':'+this.game.ip+' BELOTE '+this.game.name+' :player '+this._play+' play '+card.value);
                        player.play(card.value);
                        this._play++;
                        if(this._play >= 4) {
                            this._play = 0;
                        }
                        if(this._folds[this._currentFold].length >= 4) {
                            this._players.forEach((player) => {
                                debug('--------- '+player.client.name+' ----------');
                                debug(player._hand.map((c) => {
                                    return c.toString(true, this._trump.color);
                                }).join('\t| '));
                            });

                            this._currentFold++;
                            if(this._currentFold >= 8) {
                                end = true;
                            } else {
                                this._play = this._players.indexOf(masterCardOwner);
                            }
                            this._folds[this._currentFold-1].forEach((pc) => {
                                masterCardOwner.team.addPoints(pc[1].getPoints(this._trump.color));
                            });
                            if(this._currentFold === this._folds.length-1) {
                                masterCardOwner.team.addPoints(10);
                            }

                        }
                        if(!end) {
                            this._notifToPlay();
                        } else {
                            this.game.broadcast(':'+this.game.ip+' BELOTE '+this.game.name+' :round end');
                            this._endCallback();
                        }
                    } else {
                        player.client.socket.send(':'+this.game.ip+' BELOTE '+this.name+' ERR :this card cannot be played');
                    }
                } else {
                    player.client.socket.send(':'+this.game.ip+' BELOTE '+this.name+' ERR :you do not have this card');
                }

            } else {
                player.client.socket.send(':'+this.game.ip+' BELOTE '+this.name+' ERR :you cannot play, wait for other players');
            }
        } else {
            // l'atout n'est pas choisis
        }

    }
}

export default Round