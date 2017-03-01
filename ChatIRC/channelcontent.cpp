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

void ChannelContent::appendChat(QString message)
{
    chatContent.append(message.left(message.length() - 1));
}

QString ChannelContent::getTopic()
{
    return topic;
}

QList<QString> ChannelContent::getUsers()
{
    return users;
}

QList<QString> ChannelContent::getChatContent()
{
    return chatContent;
}
