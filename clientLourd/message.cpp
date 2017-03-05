#include "message.h"

Message::Message(QString sender, QString date, QString message):
    aSender(sender),
    aDate(date),
    aMessage(message)
{

}

QString Message::sender()
{
    return aSender;
}

QString Message::date()
{
    return aDate;
}

QString Message::message()
{
    return aMessage;
}
