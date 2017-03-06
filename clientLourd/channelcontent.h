#ifndef CHANNELCONTENT_H
#define CHANNELCONTENT_H

#include <QList>
#include <QString>

#include "message.h"
#include "user.h"
#include "mode.h"

class ChannelContent
{
public:
    //User functions
    void addUser(User *newUser);
    void removeUser(QString userName);
    void renameUser(QString oldNick, QString newNick);
    QList<User *> users();
    User* findUser(QString nick);

    //Chat functions
    void appendChat(QString heure, User *pseudo, QString message);
    void clearContent();
    QList<Message> chatContent();

    //Topic functions
    void topic(QString newTopic);
    QString topic();

    //Notifications functions
    bool notif();
    void togleNotif();
    
private:
    QString aTopic;
    QHash<User *, Mode> aUsers;
    QList<Message> aChatContent;
    bool aNotif = false;
};

#endif // CHANNELCONTENT_H
