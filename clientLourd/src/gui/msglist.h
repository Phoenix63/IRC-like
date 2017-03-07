#ifndef GUI_MSGLIST_H
#define GUI_MSGLIST_H

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
    void msgSender(QLineEdit *sender);

private:
    QList<QString> msg;
    QLineEdit *aMsgSender;
    int index;
};


#endif // MSGLIST_H
