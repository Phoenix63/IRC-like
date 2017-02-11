#include "channel.h"
#include <QColor>


Channel::Channel()
{
    channels["\"Debug\""] = QString();
    current = &(channels["\"Debug\""]);
    currentKey = QString("\"Debug\"");
}

/*
 * Channel: initialisation's function
 */

void Channel::setList(QListWidget *list)
{
    chanList = list;
    refreshChanList();
}

void Channel::setChanText(QTextBrowser *text)
{
    chanText = text;
}

void Channel::setParseurIn(Parseur::In *parseur)
{
    parseur_in = parseur;
    connect(parseur_in, SIGNAL(join_channel_signal(QString)), this, SLOT(join(QString)));
    connect(parseur_in, SIGNAL(response_signal(QString,QString,QString)), this, SLOT(appendChannel(QString,QString,QString)));
}

void Channel::setParseurOut(Parseur::Out *parseur)
{
    parseur_out = parseur;
    connect(parseur_out, SIGNAL(leave_channel_signal(QString)),this, SLOT(leave(QString)));
    connect(parseur_out, SIGNAL(send_request_signal(QString)), this, SLOT(appendCurrent(QString)));
    connect(parseur_out, SIGNAL(send_whisper_signal(QString)), this, SLOT(joinWhisper(QString)));
}

/*
 * Channel: State update
 */

void Channel::change(QString newChannel)
{
    if (channels.contains(newChannel)) {
        current = &channels[newChannel];
        currentKey = newChannel;
        chanList->findItems(newChannel,Qt::MatchExactly)[0]->setForeground(QColor("black"));
    }
   refreshText();
}

/*
 * Channel: State ui refresh
 */

void Channel::refreshText()
{
    chanText->clear();
    chanText->setText(*current);
}

void Channel::refreshChanList()
{
   chanList->clear();
   for (int i = 0; i < channels.keys().size(); i++) {
        chanList->addItem(channels.keys().at(i));
   }
}


/*
 * Channel: public slot
 */

void Channel::joinWhisper(QString dest){
    if (!channels.contains(dest))
        channels[dest] = QString();
    refreshChanList();
}

void Channel::join(QString string)
{
    QString chan = string.split(' ').at(2);
    if (!channels.contains(chan))
        channels[chan] = QString();
    refreshChanList();
}

void Channel::leave(QString channel){
    QString chan = channel.split(' ').at(1);
        if(channels.contains(chan)) {
            channels.remove(chan);
            change("\"Debug\"");
        }
        refreshChanList();
}

void Channel::appendCurrent(QString string)
{
    current->append(string);
    refreshText();
}

void Channel::appendChannel(QString string, QString channel, QString send)
{
    if(!channels.contains(channel)){
        channels[channel] = QString();
        refreshChanList();
    }
    channels[channel].append(send+string);
    refreshText();
    if(channel.compare("\"Debug\"")!=0 && channel.compare(currentKey)!=0)
        chanList->findItems(channel,Qt::MatchExactly)[0]->setForeground(QColor("red"));
}
