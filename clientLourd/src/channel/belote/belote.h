#ifndef BELOTE_H
#define BELOTE_H

#include <QMainWindow>
#include <QPushButton>
#include <QTcpSocket>

#include "card.h"
#include "customlayout.h"
#include "../channelcontent.h"

namespace Ui {
class Belote;
}

class Belote : public QMainWindow, public ChannelContent
{
    Q_OBJECT

public:
    explicit Belote(QWidget *parent = 0, QTcpSocket *socket = NULL, QString channelName = "", QString username = "");
    ~Belote();
    void lobbyWait();

    void parse(QString string);

public slots:
    void playCard();
    void take(int trump, CustomLayout *layout);
private:
    //Hand functions
    void receiveCard(int val);
    void emptyHand();
    Card * findCard();
    int position();
    void position(int val);
    void setInactive();
    void setActive(QString string);

    //UI
    void clean();
    void clearLayout(QLayout *layout);
    void chooseTeam();
    void chooseTrump(Card *card);
    void displayCard(Card *card);
    //Game functions
    void firstRound(int trump);
    void secondRound(int trump);
    //Out functions

    //In functions
    bool in_isGameStart(QString string);
    bool in_isTeamSelec(QString string);
    bool in_isCardDeal(QString string);
    bool in_isFullTeam(QString string);
    bool in_isGameReset(QString string);
    bool in_isTrumpChoice(QString string);
    bool in_isYourTurn(QString string);
    bool in_isPlayerPlay(QString string);
    bool in_isTakeTurn(QString string);
private:
    QString username;
    QString channelName;
    int aPosition;
    Ui::Belote *ui;
    QTcpSocket *socket;
    QHash<Card *, QPushButton *> hand;
};

#endif // BELOTE_H
