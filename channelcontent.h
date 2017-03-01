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
<<<<<<< HEAD
    QList<QString> getUsers();

    //Chat functions
    void appendChat(QString heure,QString pseudo,QString message);
    void clearContent();
    QList<QList<QString>> getChatContent();
=======
    void appendChat(QString message);
>>>>>>> origin/ClientLourd

    //Topic functions
    void setTopic(QString newTopic);
    QString getTopic();
<<<<<<< HEAD
=======
    QList<QString> getUsers();
    QList<QString> getChatContent();
>>>>>>> origin/ClientLourd

private:
    QString topic;
    QList<QString> users;
<<<<<<< HEAD
    QList<QList<QString>> chatContent;
=======
    QList<QString> chatContent; // To change when convert text browser to scrollarea + label
>>>>>>> origin/ClientLourd
};

#endif // CHANNELCONTENT_H
