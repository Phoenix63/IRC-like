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
    QList<QString> getUsers();

    //Chat functions
    void appendChat(QString heure, QString pseudo, QString message);
    void clearContent();
    QList<Message> getChatContent();

    //Topic functions
    void setTopic(QString newTopic);
    QString getTopic();

    //Notifications functions
    bool notif();
    void togleNotif();
private:
    QString topic;
    QList<QString> users;
    QList<Message> chatContent;
    bool aNotif = false;
};

#endif // CHANNELCONTENT_H
