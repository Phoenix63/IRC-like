#ifndef CHANNEL_CHANNELCONTENT_H
#define CHANNEL_CHANNELCONTENT_H

#include <QHash>
#include <QList>

#include "message.h"
#include "mode.h"
#include "../user/user.h"

class QString;

class ChannelContent
{
public:
    //User functions
    void addUser(User *newUser);
    void removeUser(QString userName);
    void renameUser(QString oldNick, QString newNick);
    QList<User *> users();
    User* findUser(QString nick);
    bool contains(QString nick);
    //Chat functions
    void appendChat(QString heure, User *pseudo, QString message);
    void clearContent();
    QList<Message> chatContent();

    //Topic functions
    void topic(QString newTopic);
    QString topic();

    //Notifications functions
    bool notif();
    void togleNotif(bool newValue);
    Message getLast();

	// Mode access
    bool oper(User *user);
    bool oper(QString string);
    bool voice(User *user);
    bool voice(QString string);
    void voice(User *user, bool val);
    void oper(User *user, bool val);
    void voice(QString user, bool val);
    void oper(QString user, bool val);

private:
    QString aTopic;
    QHash<User *, Mode> aUsers;
    QList<Message> aChatContent;
    bool aNotif = false;
};

#endif // CHANNELCONTENT_H
