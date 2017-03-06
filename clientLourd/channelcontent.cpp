#include "channelcontent.h"

/*
 * User functions
 */

void ChannelContent::addUser(QString newUser)
{
    if (!aUsers.contains(newUser))
        aUsers.append(newUser);
}

void ChannelContent::removeUser(QString userName)
{
    aUsers.removeAll(userName);
}

void ChannelContent::replaceUser(QString oldNick, QString newNick)
{
    if (aUsers.contains("@" + oldNick))
        aUsers[aUsers.indexOf("@" + oldNick)].replace(oldNick, newNick);
    else if (aUsers.contains(oldNick))
        aUsers[aUsers.indexOf(oldNick)].replace(oldNick, newNick);
}

QList<QString> ChannelContent::users()
{
    return aUsers;
}

/*
 * Chat functions
 */

void ChannelContent::appendChat(QString heure, QString pseudo, QString message)
{
    aChatContent.append(Message(pseudo, heure, message));
}

void ChannelContent::clearContent()
{
    while(!aChatContent.isEmpty()){
        aChatContent.pop_back();
    }
}

QList<Message> ChannelContent::chatContent()
{
    return aChatContent;
}

/*
 * Topic functions
 */

void ChannelContent::topic(QString newTopic)
{
    aTopic = newTopic;
}

QString ChannelContent::topic()
{
    return aTopic;
}
/*
 * Notifications handling
 */

bool ChannelContent::notif()
{
    return aNotif;
}

void ChannelContent::togleNotif(bool newValue)
{
    aNotif = newValue;
}

Message ChannelContent::getLast()
{
    return aChatContent.back();
}
