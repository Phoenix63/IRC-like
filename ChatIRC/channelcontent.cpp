#include "channelcontent.h"

ChannelContent::ChannelContent()
{

}

void ChannelContent::setTopic(QString newTopic)
{
    topic = newTopic;
}

void ChannelContent::addUser(QString newUser)
{
    if (!users.contains(newUser))
        users.append(newUser);
}

void ChannelContent::removeUser(QString userName)
{
    users.removeAll(userName);
}

void ChannelContent::replaceUser(QString oldNick, QString newNick)
{
    if (users.contains(oldNick))
        users[users.indexOf(oldNick)].replace(oldNick, newNick);
}

void ChannelContent::appendChat(QString heure, QString pseudo,QString message)
{
    QList<QString> list;
    list << heure << pseudo << message.left(message.length()-1);
    chatContent.append(list);
}

QString ChannelContent::getTopic()
{
    return topic;
}

QList<QString> ChannelContent::getUsers()
{
    return users;
}

QList<QList<QString>> ChannelContent::getChatContent()
{
    return chatContent;
}
