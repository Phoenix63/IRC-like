
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
        return Math.floor(this._value/8);
    }

    get high() {
        return Math.floor(this._value%8);
    }

    /**
     *
     * @param {Card} card
     * @param {number} trump
     * @return {number}
     */
    compare(card, trump) {
        if(this.color === trump && card.color !== trump) {
            return 1;
        }
        if(this.color !== trump && card.color === trump) {
            return -1;
        }
        if(this.color !== trump && card.color !== trump) {
            let order = [7,3,6,5,4,2,1,0];
            return (order.indexOf(this.high)>order.indexOf(card.high)?1:-1);
        }
        if(this.color === trump && card.color === trump) {
            let order = [4,2,7,6,5,3,1,0];
            return (order.indexOf(this.high)>order.indexOf(card.high)?1:-1);
        }
    }

    getPoints(trump) {
        if(this.color === trump) {
            let val = [0,0,14,10,20,3,4,11];
        } else {
            let val = [0,0,0,10,2,3,4,11];
        }
        return val[this.high];
    }

    toString(debug=null, trump=-1) {
        if(debug) {
            let str = '';
            switch(Math.floor(this.value/8)) {
                case 0: str = '7'; break;
                case 1: str = '8'; break;
                case 2: str = '9'; break;
                case 3: str = '10'; break;
                case 4: str = 'V'; break;
                case 5: str = 'D'; break;
                case 6: str = 'R'; break;
                case 7: str = 'A'; break;
            }
            switch(Math.floor(this.value%8)) {
                case 0: str += '♠'; break;
                case 1: str += '♥'; break;
                case 2: str += '♣'; break;
                case 3: str += '♦'; break;
            }
            if(trump !== -1) {
                return str+'('+this.getPoints(trump)+')';
            }
            return str;
        } else {
            return this._value+'';
        }

    }
}

export default Card