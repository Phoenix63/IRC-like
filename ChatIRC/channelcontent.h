#ifndef CHANNELCONTENT_H
#define CHANNELCONTENT_H

#include <QList>
#include <QString>

class ChannelContent
{
public:
    ChannelContent();

    void setTopic(QString newTopic);
    void addUser(QString newUser);
    void removeUser(QString userName);
    void replaceUser(QString oldNick, QString newNick);
    void appendChat(QString message);

    QString getTopic();
    QList<QString> getUsers();
    QList<QString> getChatContent();

private:
    QString topic;
    QList<QString> users;
    QList<QString> chatContent; // To change when convert text browser to scrollarea + label
};

#endif // CHANNELCONTENT_H