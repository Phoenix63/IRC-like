#ifndef MESSAGE_H
#define MESSAGE_H

#include <QString>

class Message
{
public:
    // Constructor
    Message(QString sender, QString date, QString message);

    // Getters
    QString sender();
    QString date();
    QString message();

private:
    QString aSender;
    QString aDate;
    QString aMessage;
};

#endif // MESSAGE
