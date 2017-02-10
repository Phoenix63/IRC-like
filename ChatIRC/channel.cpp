#include "channel.h"

Channel::Channel()
{

}

void Channel::change(QString newChannel)
{
    if (channels.contains(newChannel))
        current = &channels[newChannel];
}

QString * Channel::text()
{
    return current;
}

void Channel::append(QString channel, QString text)
{
    channels[channel].append(text);
}

void Channel::join(QString newChannel)
{
    channels[newChannel] = QString();

}

void Channel::leave(QString channel){
    QString chan = channel.split(' ').at(1);
    if(channels.contains(chan))
        channels.remove(chan);
    setQList();
}

void Channel::update(QString string)
{
        QString chan = string.split(' ').at(2);
        if (!channels.contains(chan))
            join(chan);
        setQList();
}

void Channel::setQList()
{
   chanList->clear();
   for (int i = 0; i < channels.keys().size(); i++) {
        chanList->addItem(channels.keys().at(i));
   }
}

void Channel::setList(QListWidget *list)
{
    chanList = list;
}

void Channel::setParseurIn(Parseur::In *parseur)
{
    parseur_in = parseur;
    connect(parseur_in, SIGNAL(channel_add_signal(QString)), this, SLOT(update(QString)));

}

void Channel::setParseurOut(Parseur::Out *parseur)
{
    parseur_out = parseur;
    connect(parseur_out, SIGNAL(leave_channel_signal(QString)),this, SLOT(leave(QString)));

}
