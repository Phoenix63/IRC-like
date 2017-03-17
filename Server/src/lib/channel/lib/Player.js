
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
        this.send(':'+this.game.ip+' BELOTE '+this.game.name+' :you receive cards '+card.join(','));
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
}

export default Player