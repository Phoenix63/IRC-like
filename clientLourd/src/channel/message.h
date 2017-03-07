#ifndef CHANNEL_MESSAGE_H
#define CHANNEL_MESSAGE_H

#include <QString>

#include "../user/user.h"

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
