
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
     * @param {number} firstColor
     * @param {number} trump
     * @return {number}
     */
    compare(card, firstColor, trump) {
        if(this.color === trump && card.color !== trump) {
            return 1;
        }
        if(this.color !== trump && card.color === trump) {
            return -1;
        }
        if(this.color === trump && card.color === trump) {
            let order = [4,2,7,6,5,3,1,0];
            return (order.indexOf(this.high)>order.indexOf(card.high)?1:-1);
        }
        if(this.color === firstColor && card.color === firstColor) {
            let order = [7,3,6,5,4,2,1,0];
            return (order.indexOf(this.high)>order.indexOf(card.high)?1:-1);
        }
        if(this.color === firstColor && card.color !== firstColor) {
            return 1;
        }
        if(this.color !== firstColor && card.color === firstColor) {
            return -1;
        }
        return 0;
    }

    getPoints(trump) {
        let val = [0,0,0,10,2,3,4,11]
        if(this.color === trump) {
            val = [0,0,14,10,20,3,4,11];
        }
        return val[this.high];
    }

    toString(debug=null, trump=-1) {
        if(debug) {
            let str = '';
            switch(this.high) {
                case 0: str = '7'; break;
                case 1: str = '8'; break;
                case 2: str = '9'; break;
                case 3: str = '10'; break;
                case 4: str = 'V'; break;
                case 5: str = 'D'; break;
                case 6: str = 'R'; break;
                case 7: str = 'A'; break;
            }
            switch(this.color) {
                case 0: str += '_Pi'; break;
                case 1: str += '_Co'; break;
                case 2: str += '_Tr'; break;
                case 3: str += '_Ca'; break;
            }
            if(trump !== -1) {
                return this.value+':'+str+'('+(this.getPoints(trump)>9?this.getPoints(trump):'0'+this.getPoints(trump))+')';
            }
            return str;
        } else {
            return this._value+'';
        }

    }
}

export default Card