#include "message.h"
#include <QLabel>

Message::Message(User *sender, QString date, QString message):
    aSender(sender),
    aDate(date),
    aMessage(message)
{

}

QString Message::sender()
{
    if (aSender)
        return aSender->name();
    else
        return "";
}

QString Message::date()
{
    return aDate;
}

QString Message::message()
{
    return aMessage;
}
