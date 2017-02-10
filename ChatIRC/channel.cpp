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
