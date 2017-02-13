#ifndef PARSEUR_H
#define PARSEUR_H

#include <QString>
#include <QTcpSocket>

#include "channel.h"

class Parseur {
private:
//In private function

bool in_isChanList(QString string);
bool in_isNameList(QString string);
bool in_isJoinNote(QString string);
bool in_isPartNote(QString string);
bool in_isPrivMesg(QString string);
bool in_isWhisMesg(QString string);
bool in_isPing(QString string);

public:
    //Initialisation functions
    void setChannel(Channel *channel);
    void setSocket(QTcpSocket *socket);

    //Parsing functions
    bool out(QString *string);
    void in(QString string);

private:
    //Pointer to the channel created in mainframe
    Channel *channel;
    QTcpSocket *socket;
};

#endif // PARSEUR_H
