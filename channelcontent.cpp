#include "channelcontent.h"

/*
 * Constructor
 */
ChannelContent::ChannelContent()
{

}

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
    if (users.contains(oldNick))
        users[users.indexOf(oldNick)].replace(oldNick, newNick);
}

<<<<<<< HEAD
QList<QString> ChannelContent::getUsers()
{
    return users;
}

/*
 * Chat functions
 */

void ChannelContent::appendChat(QString heure, QString pseudo,QString message)
=======
void ChannelContent::appendChat(QString message)
>>>>>>> origin/ClientLourd
{
    chatContent.append(message.left(message.length() - 1));
}

void ChannelContent::clearContent()
{
    while(!chatContent.isEmpty()){
        chatContent.pop_back();
    }
}

QList<QList<QString>> ChannelContent::getChatContent()
{
    return chatContent;
}

<<<<<<< HEAD
/*
 * Topic functions
 */

void ChannelContent::setTopic(QString newTopic)
=======
QList<QString> ChannelContent::getChatContent()
>>>>>>> origin/ClientLourd
{
    topic = newTopic;
}
<<<<<<< HEAD

QString ChannelContent::getTopic()
{
    return topic;
}


=======
>>>>>>> origin/ClientLourd
