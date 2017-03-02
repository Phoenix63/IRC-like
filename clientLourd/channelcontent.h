#ifndef CHANNELCONTENT_H
#define CHANNELCONTENT_H

#include <QList>
#include <QString>

class ChannelContent
{
public:
    //Constructor
    ChannelContent();

    //User functions
    void addUser(QString newUser);
    void removeUser(QString userName);
    void replaceUser(QString oldNick, QString newNick);
    QList<QString> getUsers();

    //Chat functions
    void appendChat(QString heure,QString pseudo,QString message);
    void clearContent();
    QList<QList<QString>> getChatContent();

    //Topic functions
    void setTopic(QString newTopic);
    QString getTopic();

private:
    QString topic;
    QList<QString> users;
    QList<QList<QString>> chatContent;
};

#endif // CHANNELCONTENT_H
