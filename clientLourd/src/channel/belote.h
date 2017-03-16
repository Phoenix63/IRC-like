#ifndef BELOTE_H
#define BELOTE_H

#include <QMainWindow>
#include <QPushButton>
#include <QTcpSocket>

#include "card.h"
#include "channelcontent.h"

namespace Ui {
class Belote;
}

class Belote : public QMainWindow, public ChannelContent
{
    Q_OBJECT

public:
    explicit Belote(QWidget *parent = 0, QTcpSocket *socket = NULL);
    ~Belote();
    void lobbyWait();

    void parse(QString string);

public slots:
    BELOTE::CARD findCard();
private:
    //Hand functions
    void receiveCard(BELOTE::CARD);
    void playCard(BELOTE::CARD);
    //Out functions

    //In functions
    bool in_isTeamSelec(QString string);
    bool in_isCardDeal(QString string);
private:
    Ui::Belote *ui;
    QTcpSocket *socket;
    QHash<BELOTE::CARD, QPushButton *> hand;
};

#endif // BELOTE_H
