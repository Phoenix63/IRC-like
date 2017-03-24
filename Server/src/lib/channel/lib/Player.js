
const debug = require('debug')('pandirc:belote:player');

class Player {
    constructor(game, client) {
        this.game = game;
        this.client = client;
        this._team = null;

        this._hand = [];
    }

    /**
     * add card to player hand
     * @param {Array<Card>} card
     */
    addCardToHand(card) {
        card.map((c)=>{
            this._hand.push(c);
        });
        this.game.rpl.receiveCards(this, card.join(','));
    }

    resetHand() {
        this._hand = [];
    }

    /**
     *
     * @return {Team|null}
     */
    get team() {
        return this._team;
    }

    /**
     * return Card if the card is valid or null if the player doesn't have this card
     * @param {number} cardvalue
     * @return {Card|null}
     */
    play(cardvalue) {
        let playedCard = null;
        for(let i=0; i<this._hand.length; i++) {
            if(this._hand[i].value === cardvalue) {
                playedCard = this._hand[i];
                break;
            }
        }
        if(playedCard) {
            let index = this._hand.indexOf(playedCard);
            this._hand = this._hand.slice(0,index).concat(this._hand.slice(index+1, this._hand.length));
            return playedCard;
        } else {
            return null;
        }
    }

    send(message) {
        this.client.socket.send(message);
    }

    /**
     *
     * @param {Team|null} t
     */
    set team(t) {
        this._team = t;
    }

    getCardByColors(colors) {
        let ret = [];
        this._hand.forEach((card) => {
            if(colors.indexOf(card.color)>=0)
                ret.push(card);
        });
        return ret;
    }

    toString() {
        return this.client.name;
    }

    getPlayableCard(trumpColor, fold) {
        let pcards = [];

        let masterCardOwner = null;
        let masterCard = null;

        if (fold.length > 0) {
            let firstCard = fold[0][1];
            let firstCardOwner = fold[0][0];
            let playercards = this.getCardByColors([firstCard.color]);
            let playertrumps = this.getCardByColors([trumpColor]);
            masterCard = firstCard;
            masterCardOwner = firstCardOwner;

            fold.forEach((arr) => {
                if (arr[1].compare(masterCard, firstCard.color, trumpColor) > 0) {
                    masterCard = arr[1];
                    masterCardOwner = arr[0];
                }

            });

            if (masterCard.color !== trumpColor && masterCard.color === firstCard.color) {
                playercards.map((c) => {
                    pcards.push(c);
                });

                if(pcards.length === 0) {
                    playertrumps.map((trump) => {
                        pcards.push(trump);
                    });
                    if (pcards.length === 0 || this.team.contains(masterCardOwner)) {
                        this._hand.map((c) => {
                            pcards.push(c);
                        });
                    }
                }

            } else {
                if (masterCard.color !== firstCard.color) {

                    if (this.team.contains(masterCardOwner)) {
                        playercards.map((c) => {
                            pcards.push(c);
                        });

                        if (pcards.length === 0) {
                            this._hand.map((c) => {
                                pcards.push(c);
                            });
                        }
                    } else {
                        playercards.map((c) => {
                            pcards.push(c);
                        })
                        if (pcards.length === 0) {
                            playertrumps.map((trump) => {
                                if (trump.compare(masterCard, firstCard.color, trumpColor) > 0)
                                    pcards.push(trump);
                            });
                            if (pcards.length === 0) {
                                playertrumps.map((trump) => {
                                    pcards.push(trump);
                                });
                                if (pcards.length === 0) {
                                    this._hand.map((c) => {
                                        pcards.push(c);
                                    })
                                }
                            }
                        }
                    }


                } else {
                    playertrumps.map((trump) => {
                        if (trump.compare(masterCard, firstCard.color, trumpColor) > 0)
                            pcards.push(trump);
                    });
                    if (pcards.length === 0) {
                        playertrumps.map((trump) => {
                            pcards.push(trump);
                        });
                        if (pcards.length === 0) {
                            this._hand.map((c) => {
                                pcards.push(c);
                            });
                        }
                    }
                }

            }
        } else {
            pcards = this._hand;
        }

        return {
            playable: pcards,
            master: {
                player: masterCardOwner,
                card: masterCard
            }
        };
    }
}

export default Player