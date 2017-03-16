#include "channelcontent.h"

/*
 * User functions
 */

void ChannelContent::addUser(User *newUser)
{
    for (auto i:aUsers.keys()) {
        if( i == newUser)
            return;
    }
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

QStringList ChannelContent::userList()
{
    QStringList tmp;
    for (auto i:aUsers.keys()) {
        tmp.append(i->name());
    }
    return tmp;
}

User * ChannelContent::findUser(QString nick)
{
    for (auto i:aUsers.keys()) {
        if (i->name() == nick)
            return i;
    }
    return nullptr;
}

bool ChannelContent::contains(QString nick)
{
    for (auto i:aUsers.keys()) {
		if(i->name() == nick)
			return true;
	}
	return false;
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

/*
 * Mode functions
 */

bool ChannelContent::oper(User *user)
{
    return aUsers[user].chanOperator();
}


bool ChannelContent::oper(QString user)
{
    if (User *tmp = findUser(user))
        return aUsers[tmp].chanOperator();
    return false;
}

bool ChannelContent::voice(User *user)
{
    return aUsers[user].chanVoice();
}

bool ChannelContent::voice(QString user)
{
    if (User *tmp = findUser(user))
        return aUsers[tmp].chanVoice();
    return false;
}

/*
 * Setters
 */

void ChannelContent::oper(User *user, bool value)
{
    aUsers[user].chanOperator(value);
}

void ChannelContent::oper(QString user, bool value)
{
    if (User *tmp = findUser(user))
        aUsers[tmp].chanOperator(value);
}

void ChannelContent::voice(User *user, bool value)
{
    aUsers[user].chanVoice(value);
}

void ChannelContent::voice(QString user, bool value)
{
    if (User *tmp = findUser(user))
        aUsers[tmp].chanVoice(value);
}
