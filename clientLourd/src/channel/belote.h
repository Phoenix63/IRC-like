#ifndef BELOTE_H
#define BELOTE_H

#include <QMainWindow>
#include <QTcpSocket>

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
private:
    //Out functions

    //In functions
    bool in_isTeamSelec(QString string);
private:
    Ui::Belote *ui;
    QTcpSocket *socket;
};

#endif // BELOTE_H
