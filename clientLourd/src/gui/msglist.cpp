#include "msglist.h"

#include <QLineEdit>

MsgList::MsgList()
{
    index = 0;
    msg.append("");
}

void MsgList::addMsg(QString string)
{
    msg[0] = string;
    msg.prepend("");
}

void MsgList::msgSender(QLineEdit *sender)
{
    aMsgSender = sender;
}

void MsgList::scrollUp()
{
    if (index < msg.size() - 1)
        index++;
    aMsgSender->setText(msg[index]);
}

void MsgList::scrollDown()
{
    if (index > 0)
        index--;
    aMsgSender->setText(msg[index]);
}

void MsgList::scrollReset()
{
    aMsgSender->setText("");
    index = 0;
}
