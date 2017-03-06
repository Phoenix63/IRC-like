#ifndef CHANNELCONTENT_H
#define CHANNELCONTENT_H

#include <QList>
#include <QString>

#include "message.h"

class ChannelContent
{
public:
    //User functions
    void addUser(QString newUser);
    void removeUser(QString userName);
    void replaceUser(QString oldNick, QString newNick);
    QList<QString> users();

    //Chat functions
    void appendChat(QString heure, QString pseudo, QString message);
    void clearContent();
    QList<Message> chatContent();

    //Topic functions
    void topic(QString newTopic);
    QString topic();

    //Notifications functions
    bool notif();
    void togleNotif(bool newValue);

    Message getLast();
private:
    QString aTopic;
    QList<QString> aUsers;
    QList<Message> aChatContent;
    bool aNotif = false;
};

#endif // CHANNELCONTENT_H
