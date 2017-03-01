#ifndef MSGLIST_H
#define MSGLIST_H

#include <QList>
#include <QString>

class QLineEdit;

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
