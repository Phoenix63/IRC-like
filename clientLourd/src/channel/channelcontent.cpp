#include "channelcontent.h"

/*
 * User functions
 */

void ChannelContent::addUser(User *newUser)
{
    if (!aUsers.keys().contains(newUser))
        aUsers[newUser] = Mode();
}

void ChannelContent::removeUser(QString userName)
{
    for (auto i:aUsers.keys()) {
        if (i->name() == userName)
            aUsers.remove(i);
    }
}

void ChannelContent::renameUser(QString oldNick, QString newNick)
{
    for(auto i:aUsers.keys()){
    if (i->name().contains(oldNick))
        i->name(newNick);
    }
}

QList<User *> ChannelContent::users()
{
    return aUsers.keys();
}

User * ChannelContent::findUser(QString nick)
{
    for (auto i:aUsers.keys()){
        if (i->name() == nick)
            return i;
    }
    return nullptr;
}

/*
 * Chat functions
 */

void ChannelContent::appendChat(QString heure, User *pseudo, QString message)
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
