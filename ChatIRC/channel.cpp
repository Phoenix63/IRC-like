#include "channel.h"
#include <QDebug>

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
 * Channel: Initialisation functions
 */

void Channel::setUi(QListWidget *list, QVBoxLayout *text, QListWidget *uList, QLineEdit *tText, QLineEdit *mText)
{
    chanList = list;
    chanText = text;
    userList = uList;
    topicText = tText;
    messageText = mText;
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
        channels[chan] = ChannelContent();
        channels[chan].setTopic(topic);
    }
    refreshChanList();
}

void Channel::joinWhisper(QString dest){
    if (!channels.contains(dest))
        channels[dest] = ChannelContent();
    refreshChanList();
}

/*
 * Channel: UI statues update functions
 */

void Channel::refreshText()
{
    clean();
    QList<QList<QString>> text = channels[currentChannel].getChatContent();
    for (auto i:text ){
        chanText->addLayout(parseur.parse(i[0], i[1], i[2]));
    }
}

void Channel::refreshChanList()
{
   chanList->clear();
   for (auto i:channels.keys()) {
        chanList->addItem(i);
   }
}

/*
 * Channel: Channel quit functions
 */

void Channel::leave(QString chan){
    if(channels.contains(chan)) {
        channels.remove(chan);
        change("\"Debug\"");
        refreshChanList();
    }
}

/*
 * Channel: Text adding functions
 */

void Channel::appendCurrent(QString string)
{
    QString time = '['+QTime::currentTime().toString()+']';
    channels[currentChannel].appendChat(time+"    ","You"," : "+string);
    chanText->addLayout(parseur.parse(time+"    ","You"," : "+string.left(string.length() - 1)));
}

void Channel::appendChannel(QString string, QString channel, QString send)
{
    qDebug() << string;
    QString time = '['+QTime::currentTime().toString()+']';
    channels[channel].appendChat(time+"    ", send," : " +string);
    if (channel == currentChannel)
        chanText->addLayout(parseur.parse(time , send ," : " +string.left(string.length()-1)));
    if(channel != "\"Debug\"" && channel != currentChannel)
        chanList->findItems(channel,Qt::MatchExactly)[0]->setForeground(QColor("red"));
}

/*
 * Channel: Current channel change function
 */

void Channel::change(QString newChannel)
{
    if (channels.contains(newChannel)) {
        currentChannel = newChannel;
        chanList->findItems(newChannel,Qt::MatchExactly)[0]->setForeground(QColor("black"));
    }
   refreshText();
   refreshUserList();
   refreshTopic();
   messageText->setPlaceholderText("Message "+channelName());
}

/*
 * Channel: Current channel name getter
 */

QString Channel::channelName()
{
    return currentChannel;
}

/*
 * User list functions
 */


void Channel::addUser(QString user, QString channel)
{
    if (user[0] == '@')
        user = user.right(user.length() - 1);
    channels[channel].addUser(user);
    refreshUserList();
}

void Channel::delUser(QString user, QString channel)
{
    channels[channel].removeUser(user);
    if (channel == currentChannel)
        refreshUserList();
}

void Channel::refreshUserList()
{
    userList->clear();
    QList<QString> users = channels[currentChannel].getUsers();
    for (auto i:users) {
         userList->addItem(i);
    }
}


void Channel::refreshTopic()
{
    topicText->clear();
    topicText->setText(channels[currentChannel].getTopic());
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
    refreshUserList();
    refreshChanList();
}

void Channel::clearLayout(QLayout *layout)
{
    QLayoutItem *item;
    while((item = layout->takeAt(0))) {
        if (item->layout()) {
            clearLayout(item->layout());
            delete item->layout();
        }
        if (item->widget()) {
            delete item->widget();
        }
        delete item;
    }
}

void Channel::clean()
{
    QLayoutItem *item;
    while ((item = chanText->takeAt(0))) {
        clearLayout(item->layout());
    }
}

QHash<QString, QPixmap> * Channel::getHashMap()
{
    return parseur.getHashMap();
}
