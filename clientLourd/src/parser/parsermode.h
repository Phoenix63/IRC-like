#ifndef PARSERMODE_H
#define PARSERMODE_H

#include "channel.h"
#include "userlist.h"

#include <QString>

class ParserMode
{
public:
    ParserMode(Channel *chan);
    //User Mode
    void parseUser(QString string);
    bool isIUserMode (QString mode, QString user);
    bool isOUserMode (QString mode, QString user);
    bool isWMode (QString mode, QString user);

    //Channel Mode
    void parseChan(QString string);
    bool isIChanMode(QString mode);
    bool isOChanMode(QString mode, QString string);
    bool isPMode(QString mode);
    bool isSMode(QString mode);
    bool isTMode(QString mode);
    bool isNMode(QString mode);
    bool isMMode(QString mode);
    bool isLMode(QString mode, QString string);
    bool isBMode(QString mode, QString string);
    bool isVMode(QString mode, QString string);
    bool isKMode(QString mode, QString string);
private:
    Channel *channel;
    UserList userList;
};

#endif // PARSERMODE_H
