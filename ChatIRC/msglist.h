#ifndef MSGLIST_H
#define MSGLIST_H

#include <QList>
#include <QString>
#include <QLineEdit>
#include <QDebug>

class MsgList
{
public:
    MsgList();
    void addMsg(QString string);
    void scrollReset();
    void scrollUp();
    void scrollDown();
    void setMsgSender(QLineEdit *sender);

private:
    QList<QString> msg;
    QLineEdit *msgSender;
    int index;
};

#endif // MSGLIST_H
