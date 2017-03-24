#ifndef PARSER_PARSERMODE_H
#define PARSER_PARSERMODE_H

#include "../user/userlist.h"

class QString;

class Channel;

class ParserMode
{
public:
    ParserMode(Channel *chan);
    //User Mode
    void parseUser(QString string);
    bool isBUserMode(QString mdoe, QString user);
    bool isIUserMode(QString mode, QString user);
    bool isOUserMode(QString mode, QString user);
    bool isWMode(QString mode, QString user);

    //Channel Mode
    void parseChan(QString string);
    bool isIChanMode(QString mode, QString channel);
    bool isOChanMode(QString mode, QString channel, QString arg);
    bool isPMode(QString mode, QString channel);
    bool isSMode(QString mode, QString channel);
    bool isTMode(QString mode, QString channel);
    bool isNMode(QString mode, QString channel);
    bool isMMode(QString mode, QString channel);
    bool isLMode(QString mode, QString channel, QString arg);
    bool isBChanMode(QString mode, QString channel, QString arg);
    bool isVMode(QString mode, QString channel, QString arg);
    bool isKMode(QString mode, QString channel, QString arg);
private:
    Channel *channel;
    UserList userList;
};

#endif // PARSERMODE_H
