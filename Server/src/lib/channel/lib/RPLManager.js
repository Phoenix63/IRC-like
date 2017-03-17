class RPLManager {
    constructor(game) {
        this.game = game;
        this.head = ':'+this.game.ip+' BELOTE '+this.game.name;
    }


    /*
     *
     * ============================
     * =                          =
     * =       ~ RESPONSES ~      =
     * =                          =
     * ============================
     */


    gameSelection() {
        this.game.broadcast(this.head+' 1001 :team selection');
    }

    gameStart(teams) {
        this.game.broadcast(this.head+' 1002 :game start');
        this.game.broadcast(this.head+' 1003 :0 '+teams[0].toString());
        this.game.broadcast(this.head+' 1003 :1 '+teams[1].toString());
    }

    teamScore(a,b) {
        this.game.broadcast(this.head+' 1004 :team points '+a+','+b);
    }

    gameReset() {
        this.game.broadcast(this.head+' 1005 :game reset');
    }

    receiveCards(player, cards) {
        player.send(this.head+' 1006 :you receive cards '+cards);
    }

    roundEnd() {
        this.game.broadcast(this.head+' 1007 :round end');
    }

    trumpIs(card) {
        this.game.broadcast(this.head+' 1008 :donald is '+card);
    }

    playerTake(turn, trump) {
        this.game.broadcast(this.head+' 1009 : player '+turn+' take '+trump+' color '+trump.color);
    }

    playerTurn(player, cards) {
        player.send(this.head+' 1010 :it is your turn '+cards);
    }

    playerHaveToTake(player, trump, turn) {
        player.send(this.head+' 1011 :'+trump+' ('+turn+')');
    }

    playerDoNotTake() {
        this.game.broadcast(this.head+' 1012 :player did not take');
    }

    playerPlay(turn, card) {
        this.game.broadcast(this.head+' 1013 :player '+turn+' play '+card);
    }

    teamJoin(player, team) {
        this.game.broadcast(this.head+' 1014 :'+player+' join '+team);
    }

    roundStart(players) {
        this.game.broadcast(this.head+' 1015 :round start '+players);
    }

    teamWin(id) {
        this.game.broadcast(this.head+' 1016 :team '+id+' win');
    }

    /*
    *
    * ============================
    * =                          =
    * =         ~ ERRORS ~       =
    * =                          =
    * ============================
     */

    ERR_NOTINGAME(socket) {
        socket.send(this.head+' 1101 :you are not in this game');
    }
    ERR_INVALIDTEAMID(socket) {
        socket.send(this.head+' 1102 :invalid team id');
    }
    ERR_NOTYOURTURN(socket) {
        socket.send(this.head+' 1103 :not your turn');
    }
    ERR_INVALIDCOLORVAL(socket) {
        socket.send(this.head+' 1104 :invalid color value');
    }
    ERR_PLAYERISCOW(socket) {
        socket.send(this.head+' 1105 :you need to take, you are the cow');
    }
    ERR_WRONGCOLOR(socket) {
        socket.send(this.head+' 1106 :cannot take this card here');
    }
    ERR_INVALIDCARD(socket) {
        socket.send(this.head+' 1107 :invalid card, you could play better');
    }
    ERR_PLAYERDONOTHAVECARD(socket) {
        socket.send(this.head+' 1108 :you do not have this card');
    }
    ERR_TEAMISFULL(socket) {
        socket.send(this.head+' 1109 :team is full');
    }

}

export default RPLManager