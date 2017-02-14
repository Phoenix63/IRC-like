#include "msglist.h"

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


void MsgList::setMsgSender(QLineEdit *sender)
{
    msgSender = sender;
}

void MsgList::scrollUp()
{
    if (index < msg.size() - 1)
        index++;
    msgSender->setText(msg[index]);
}

void MsgList::scrollDown()
{
    if (index > 0)
        index--;
    msgSender->setText(msg[index]);
}

void MsgList::scrollReset()
{
    msgSender->setText("");
    index = 0;
}
