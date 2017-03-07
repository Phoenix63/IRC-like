#ifndef CHANNEL_CHANNEL_H
#define CHANNEL_CHANNEL_H

#include <QHash>
#include <QString>

#include "channelcontent.h"
#include "message.h"
#include "parseremoji.h"
#include "../user/userlist.h"

class QColor;
class QLabel;
class QLineEdit;

template<typename> class QList;

class Channel
{
public:
    // Constructor
    Channel(ParserEmoji *emoji);

    // Getters
    QList<Message> chatContent();

    // Channel creation functions
    void join(QString chan, QString topic);
    void joinWhisper(QString dest);

    // Channel quit functions
    void leave(QString channel);

    // Text adding function
    void appendChannel(QString string, QString channel, QString send);
    void appendCurrent(QString string, QString pseudo);
    void appendChannel(QString string, QString channel, User *send);
    void appendCurrent(QString string, User * pseudo);
    void clean();

    // Current channel change function
    void change(QString newChannel);

    // Current channel name getter
    QString channelName();
    QList<QString> channelNames();

    // User functions
    void addUser(QString user, QString channel);
    void addUser(User *user);
    void delUser(QString user, QString channel);
    void changeNick(QString user, QString nick);
    QList<User *> users();

    // Topic
    void topic(QString topic, QString channel);
    QString topic();

    //Notifications
    bool notif(QString chan);
    void togleNotif(QString chan, bool newValue);
    Message getLast();
private:
    ParserEmoji * emoji;
    UserList userList;
    // Current channel name
    QString currentChannel;
    // Qhash wich contain message: key = channel name, content = message list
    QHash<QString, ChannelContent> channels;
};

#endif // CHANNEL_H
