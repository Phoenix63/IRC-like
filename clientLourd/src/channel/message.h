#ifndef MESSAGE_H
#define MESSAGE_H

#include <QString>

#include "user.h"

class Message
{
public:
    // Constructor
    Message(User *sender, QString date, QString message);

    // Getters
    QString sender();
    QString date();
    QString message();

private:
    User* aSender;
    QString aDate;
    QString aMessage;
};

#endif // MESSAGE
