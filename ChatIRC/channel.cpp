#include "channel.h"
#include <QDebug>

/*
 * Channel: Constructor
 */

Channel::Channel()
{
    channels["\"Debug\""] = QString();
    current = &(channels["\"Debug\""]);
    currentKey = QString("\"Debug\"");
    users["\"Debug\""].append("The godly dev");
    currentList = &(users["\"Debug\""]);
    topics["\"Debug\""] = QString("Here we see debug command.");
    currentTopic = &(topics["\"Debug\""]);
}

/*
 * Channel: Initialisation functions
 */

void Channel::setUi(QListWidget *list, QTextBrowser *text, QListWidget *uList, QLineEdit *tText)
{
    chanList = list;
    chanText = text;
    userList = uList;
    topicText = tText;
    refreshChanList();
    refreshUserList();
    refreshTopic();
}

/*
 * Channel: Channel creation functions
 */

void Channel::join(QString chan, QString topic)
{
    if (!channels.contains(chan)) {
        channels[chan] = QString();
        topics[chan] = topic;
    }
    refreshChanList();
}

void Channel::joinWhisper(QString dest){
    if (!channels.contains(dest))
        channels[dest] = QString();
    refreshChanList();
}

/*
 * Channel: UI statues update functions
 */

void Channel::refreshText()
{
    chanText->clear();
    chanText->setText(current->left(current->length()-1));
}

void Channel::refreshChanList()
{
   chanList->clear();
   for (int i = 0; i < channels.keys().size(); i++) {
        chanList->addItem(channels.keys().at(i));
   }
}

/*
 * Channel: Channel quit functions
 */

void Channel::leave(QString chan){
    if(channels.contains(chan)) {
        channels.remove(chan);
        change("\"Debug\"");
    }
    refreshChanList();
}

/*
 * Channel: Text adding functions
 */

void Channel::appendCurrent(QString string)
{
    current->append(string);
    refreshText();
}

void Channel::appendChannel(QString string, QString channel, QString send)
{
    if(!channels.contains(channel)) {
        channels[channel] = QString();
        refreshChanList();
    }
    channels[channel].append(send + string);
    if (channel == currentKey)
        chanText->append(send + string.left(string.length()-1));
    if(channel.compare("\"Debug\"")!=0 && channel.compare(currentKey)!=0)
        chanList->findItems(channel,Qt::MatchExactly)[0]->setForeground(QColor("red"));
}

/*
 * Channel: Current channel change function
 */

void Channel::change(QString newChannel)
{
    if (channels.contains(newChannel)) {
        current = &channels[newChannel];
        currentList = &users[newChannel];
        currentTopic = &topics[newChannel];
        currentKey = newChannel;
        chanList->findItems(newChannel,Qt::MatchExactly)[0]->setForeground(QColor("black"));
    }
   refreshText();
   refreshUserList();
   refreshTopic();
}

/*
 * Chanenl: Current channel name getter
 */

QString Channel::channelName()
{
    return currentKey;
}


void Channel::addUser(QString user, QString channel)
{
    if (user[0] == '@')
        user = user.right(user.length() - 1);
    if (!users[channel].contains(user))
        users[channel].append(user);
    refreshUserList();

}

void Channel::delUser(QString user, QString channel)
{
    users[channel].removeAll(user);
    refreshUserList();
}

void Channel::refreshUserList()
{
    userList->clear();
    for (int i = 0; i < currentList->size(); i++) {
         userList->addItem(currentList->at(i));
    }
}


void Channel::refreshTopic()
{
    topicText->clear();
    topicText->setText(*currentTopic);
}
