#include "channel.h"

#include <QColor>
#include <QLabel>
#include <QLineEdit>
#include <QList>
#include <QListWidget>
#include <QTextBrowser>
#include <QTime>
#include <QVBoxLayout>

/*
 * Channel: Constructor
 */

Channel::Channel(ParserEmoji *emoji):
    emoji(emoji)
{
    currentChannel = QString("\"Debug\"");
    channels[currentChannel] = new ChannelContent();
    channels[currentChannel]->topic("Here we see debug command.");
}

/*
 * Getters
 */

 QList<Message> Channel::chatContent()
 {
     return channels[currentChannel]->chatContent();
 }

/*
 * Channel: Channel creation functions
 */

void Channel::join(QString chan, QString topic)
{
    if (!channels.contains(chan)) {
        channels[chan] = new ChannelContent();
        channels[chan]->topic(topic);
    }
}

void Channel::joinWhisper(QString dest){
    if (!channels.contains(dest))
        channels[dest] = new ChannelContent();
}
/*
 * Channel: Belote
 */

void Channel::joinBelote(QString room, QTcpSocket *socket, QString nick)
{
    if (!channels.contains(room))
        channels[room] = new Belote(NULL, socket, room, nick);
}

void Channel::beloteParse(QString room, QString command)
{
    channels[room]->parse(command);
}

/*
 * Channel: Channel quit functions
 */

void Channel::leave(QString chan){
    if(channels.contains(chan) && chan.compare("\"Debug\"") != 0) {
        change("\"Debug\"");
        delete channels[chan];
        channels.remove(chan);
    }
}

/*
 * Channel: Text adding functions
 */

 void Channel::appendCurrent(QString string, QString pseudo)
 {
     QString time = '[' + QTime::currentTime().toString() + ']';
     if (channels.contains(currentChannel))
         channels[currentChannel]->appendChat(time + "    ", channels[currentChannel]->findUser(pseudo) , " : " + emoji->parse(string));
 }

 void Channel::appendChannel(QString string, QString channel, QString send)
 {
     QString time = '[' + QTime::currentTime().toString() + ']';
     if (channels.contains(channel))
         channels[channel]->appendChat(time + "    ", channels[channel]->findUser(send)," : " + emoji->parse(string));
 }

 void Channel::appendCurrent(QString string, User *pseudo)
 {
     QString time = '[' + QTime::currentTime().toString() + ']';
     if (channels.contains(currentChannel))
         channels[currentChannel]->appendChat(time + "    ", pseudo, " : " + emoji->parse(string));
 }

 void Channel::appendChannel(QString string, QString channel, User *send)
 {
     QString time = '[' + QTime::currentTime().toString() + ']';
     if (channels.contains(channel))
         channels[channel]->appendChat(time + "    ", send," : " + emoji->parse(string));
 }

void Channel::clean(){
    channels[currentChannel]->clearContent();
}

/*
 * Channel: Current channel change function
 */

void Channel::change(QString newChannel)
{
    if (channels.contains(newChannel))
        currentChannel = newChannel;
}

/*
 * Channel: Current channel name getter
 */

QString Channel::channelName()
{
    return currentChannel;
}

QList<QString> Channel::channelNames()
{
    return channels.keys();
}

void Channel::changeName(QString oldChan, QString newChan)
{
	channels[newChan] = channels.take(oldChan);
}

/*
 * User list functions
 */

void Channel::addUser(QString user, QString channel)
{
    if(channels.keys().contains(channel)) {
        if(user.startsWith('@')) {
            user.remove(0, 1);
            channels[channel]->addUser(aUserList.addUser(user));
            channels[channel]->oper(user, true);
        } else {
            channels[channel]->addUser(aUserList.addUser(user));
        }
    }
}

void Channel::addUser(User *user)
{
    aUserList.addUser(user);
}

void Channel::addUser(QString user)
{
    aUserList.addUser(user);
}

void Channel::deleteUser(QString user)
{
    aUserList.deleteUser(user);
}

void Channel::removeUser(QString user, QString channel)
{
    if (channels.contains(channel))
        channels[channel]->removeUser(user);
}

QList<User *> Channel::users()
{
    return channels[currentChannel]->users();
}

QStringList Channel::userList()
{
    return channels[currentChannel]->userList();
}

bool Channel::contains(QString nick, QString channel)
{
	return channels[channel]->contains(nick);
}

void Channel::changeNick(QString nick, QString newNick)
{
    for (auto i:channels.keys()) {
        channels[i]->renameUser(nick, newNick);
    }
    if (channels.keys().contains(nick)) {
        channels[newNick] = channels[nick];
        channels.remove(nick);
    }
}
/*
 * Mode functions
 */

bool Channel::voice(User *user, QString chan)
{
    return channels[chan]->voice(user);
}

bool Channel::oper(User *user, QString chan)
{
    return channels[chan]->oper(user);
}

void Channel::voice(User *user, QString chan, bool value)
{
    channels[chan]->voice(user, value);
}

void Channel::oper(User *user, QString chan, bool value)
{
    channels[chan]->oper(user, value);
}

void Channel::voice(QString user, QString chan, bool value)
{
    channels[chan]->voice(user,value);
}

void Channel::oper(QString user, QString chan, bool value)
{
    channels[chan]->oper(user,value);
}

/*
 * Topic functions
 */

void Channel::topic(QString topic, QString channel)
{
    if (channels.contains(channel))
        channels[channel]->topic(topic);
}

QString Channel::topic()
{
    return channels[currentChannel]->topic();
}

bool Channel::notif(QString chan)
{
    if (channels.contains(chan))
        return channels[chan]->notif();
    else return false;
}

void Channel::togleNotif(QString chan, bool newValue)
{
    if (channels.contains(chan))
            channels[chan]->togleNotif(newValue);
}

Message Channel::getLast()
{
    return channels[currentChannel]->getLast();
}

/*
 * Voice and operator getters
 */

bool Channel::oper(User *user)
{
    return channels[currentChannel]->oper(user);
}


bool Channel::oper(QString user)
{
    return channels[currentChannel]->oper(user);
}
bool Channel::voice(User *user)
{
    return channels[currentChannel]->voice(user);
}

bool Channel::voice(QString user)
{
    return channels[currentChannel]->voice(user);
}
