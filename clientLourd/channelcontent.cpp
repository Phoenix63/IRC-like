#include "channelcontent.h"

/*
 * User functions
 */

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
    if (users.contains("@" + oldNick))
        users[users.indexOf("@" + oldNick)].replace(oldNick, newNick);
    else if (users.contains(oldNick))
        users[users.indexOf(oldNick)].replace(oldNick, newNick);
}

QList<QString> ChannelContent::getUsers()
{
    return users;
}

/*
 * Chat functions
 */

void ChannelContent::appendChat(QString heure, QString pseudo, QString message)
{
    chatContent.append(Message(pseudo, heure, message));
}

void ChannelContent::clearContent()
{
    while(!chatContent.isEmpty()){
        chatContent.pop_back();
    }
}

QList<Message> ChannelContent::getChatContent()
{
    return chatContent;
}

/*
 * Topic functions
 */

void ChannelContent::setTopic(QString newTopic)
{
    topic = newTopic;
}

QString ChannelContent::getTopic()
{
    return topic;
}
