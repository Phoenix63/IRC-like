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
    explicit Belote(QWidget *parent = 0, QTcpSocket *socket = NULL, QString channelName = "", QString username = "");
    ~Belote();
    void lobbyWait();

    void parse(QString string);

public slots:
    BELOTE::CARD findCard();
private:
    //Hand functions
    void receiveCard(BELOTE::CARD);
    void playCard(BELOTE::CARD);
    void emptyHand();
    //UI
    void clean();
    void clearLayout(QLayout *layout);
    void chooseTeam();
    //Out functions

    //In functions
    bool in_isTeamSelec(QString string);
    bool in_isCardDeal(QString string);
    bool in_isPartNote(QString string);
    bool in_isFullTeam(QString string);
    bool in_isGameReset(QString string);
private:
    QString username;
    QString channelName;
    Ui::Belote *ui;
    QTcpSocket *socket;
    QHash<BELOTE::CARD, QPushButton *> hand;
};

#endif // BELOTE_H
