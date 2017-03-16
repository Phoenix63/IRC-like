
class Card {

    constructor(value) {
        if(value > 31 || value < 0) {
            throw "Card value error";
        }
        this._value = value;
    }

    get value() {
        return this._value;
    }

    get color() {
        return Math.floor(this._value%4);
    }

    /**
     *
     * @param {Card} card
     * @param {number} atout
     * @return {number}
     */
    compare(card, atout) {
        if(Math.floor(this.value%4) === atout && Math.floor(card.value%4) !== atout) {
            return 1;
        }
        if(Math.floor(this.value%4) !== atout && Math.floor(card.value%4) === atout) {
            return -1;
        }
        if(Math.floor(this.value%4) !== atout && Math.floor(card.value%4) !== atout) {
            let order = [7,3,6,5,4,2,1,0];
            return (order.indexOf(Math.floor(this.value/4))>order.indexOf(Math.floor(card.value/4))?1:-1);
        }
        if(Math.floor(this.value%4) === atout && Math.floor(card.value%4) === atout) {
            let order = [4,2,7,6,5,3,1,0];
            return (order.indexOf(Math.floor(this.value/4))>order.indexOf(Math.floor(card.value/4))?1:-1);
        }
    }

    getPoints(atout) {
        if(Math.floor(this.value%4) === atout) {
            let val = [0,0,14,10,20,3,4,11];
        } else {
            let val = [0,0,0,10,2,3,4,11];
        }
        return val[Math.floor(this.value/4)];
    }

    toString(debug=null, atout=-1) {
        if(debug) {
            let str = '';
            switch(Math.floor(this.value/4)) {
                case 0: str = '7'; break;
                case 1: str = '8'; break;
                case 2: str = '9'; break;
                case 3: str = '10'; break;
                case 4: str = 'V'; break;
                case 5: str = 'D'; break;
                case 6: str = 'R'; break;
                case 7: str = 'A'; break;
            }
            switch(Math.floor(this.value%4)) {
                case 0: str += '♠'; break;
                case 1: str += '♥'; break;
                case 2: str += '♣'; break;
                case 3: str += '♦'; break;
            }
            if(atout !== -1) {
                return str+'('+this.getPoints(atout)+')';
            }
            return str;
        } else {
            return this._value+'';
        }

    }
}

export default Card