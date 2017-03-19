
import Card from './Card';

class Deck {
    constructor() {
        this._cards = [];
        for(let i=0; i<32; i++) {
            this._cards.push(new Card(i));
        }
        this._cards.sort(function() {
            return (Math.round(Math.random())-1===0?-1:1);
        });
        this._played = [];
    }

    cut() {
        let cut = Math.floor(Math.random()*20)+6;
        this._cards = this._cards.slice(cut, this._cards.length).concat(this._cards.slice(0,cut));
    }

    /**
     * pop card from this.cards and return it
     * @param nb
     * @return {Array<Card>}
     */
    getCards(nb) {
        let arr = [];
        for(var i=0; i<nb; i++) {
            arr.push(this._cards.pop());
        }
        return arr;
    }

    reset() {
        if(this._played.length === 32) {
            this._cards = this._played;
        }
    }

    toString() {
        return '\n------- CARDS ------\n'+this._cards.join(' | ')+'\n---------- PLAYED -------\n'+this._played.join(' | ')+'\n';
    }
}

export default Deck