#include "channel.h"

#include <QListWidget>
#include <QTextBrowser>
#include <QLineEdit>
#include <QColor>
#include <QVBoxLayout>
#include <QLabel>
#include <QTime>
#include <QList>
/*
 * Channel: Constructor
 */

Channel::Channel()
{
    currentChannel = QString("\"Debug\"");
    channels[currentChannel] = ChannelContent();
    channels[currentChannel].addUser("The godly dev");
    channels[currentChannel].setTopic("Here we see debug command.");
}

/*
 * Getters
 */

 QList<Message> Channel::getChatContent()
 {
     return channels[currentChannel].getChatContent();
 }

/*
 * Channel: Channel creation functions
 */

void Channel::join(QString chan, QString topic)
{
    if (!channels.contains(chan)) {
        channels[chan] = ChannelContent();
        channels[chan].setTopic(topic);
    }
}

void Channel::joinWhisper(QString dest){
    if (!channels.contains(dest))
        channels[dest] = ChannelContent();
}

/*
 * Channel: Channel quit functions
 */

void Channel::leave(QString chan){
    if(channels.contains(chan) && chan.compare("\"Debug\"") != 0) {
        change("\"Debug\"");
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
        channels[currentChannel].appendChat(time + "    ", pseudo , " : " + string);
}

void Channel::appendChannel(QString string, QString channel, QString send)
{
    QString time = '[' + QTime::currentTime().toString() + ']';
    if (channels.contains(channel))
        channels[channel].appendChat(time + "    ", send," : " + string);
}

void Channel::clean(){
    channels[currentChannel].clearContent();
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

/*
 * User list functions
 */

void Channel::addUser(QString user, QString channel)
{
    if (channels.contains(channel))
        channels[channel].addUser(user);
}

void Channel::delUser(QString user, QString channel)
{
    if (channels.contains(channel))
        channels[channel].removeUser(user);
}

QList<QString> Channel::getUsers()
{
    return channels[currentChannel].getUsers();
}

void Channel::changeNick(QString nick, QString newNick)
{
    for (auto i:channels.keys()) {
        channels[i].replaceUser(nick, newNick);
    }
    if (channels.keys().contains(nick)) {
        channels[newNick] = channels[nick];
        channels.remove(nick);
    }
}

void Channel::setTopic(QString topic, QString channel)
{
    if (channels.contains(channel))
        channels[channel].setTopic(topic);
}

QString Channel::getTopic()
{
    return channels[currentChannel].getTopic();
}

bool Channel::notif(QString chan)
{
    if (channels.contains(chan))
        return channels[chan].notif();
    else return false;
}

void Channel::togleNotif(QString chan)
{
    if (channels.contains(chan))
        channels[chan].togleNotif();
}
