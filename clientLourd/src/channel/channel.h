#ifndef CHANNEL_CHANNEL_H
#define CHANNEL_CHANNEL_H

#include <QHash>
#include <QString>
#include <QTcpSocket>

#include "belote/belote.h"
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

    //Belote commands
    void joinBelote(QString room, QTcpSocket *socket, QString nick);
    void beloteParse(QString room, QString command);
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
    void changeName(QString oldChan, QString newChan);

    // User functions
    void addUser(QString user, QString channel);
    void addUser(User *user);
    void addUser(QString user);
	void deleteUser(QString user);
    void removeUser(QString user, QString channel);
    void changeNick(QString user, QString nick);
    QList<User *> users();
    QStringList userList();
    bool contains(QString nick, QString channel);

    // User mode
    bool oper(User *user, QString chan);
    bool oper(User *user);
    bool oper(QString string);
    bool voice(User *user);
    bool voice(User *user, QString chan);
    bool voice(QString string);
    void voice(User *user, QString chan, bool val);
    void oper(User *user, QString chan, bool val);
    void voice(QString user, QString chan, bool val);
    void oper(QString user, QString chan, bool val);

    void modeI(bool mode, QString user);
    void modeO(bool mode, QString user);
    void modeW(bool mode, QString user);

    // Topic
    void topic(QString topic, QString channel);
    QString topic();

    //Notifications
    bool notif(QString chan);
    void togleNotif(QString chan, bool newValue);
    Message getLast();
private:
    ParserEmoji * emoji;
    // Current channel name
    QString currentChannel;
    // Qhash wich contain message: key = channel name, content = message list
    QHash<QString, ChannelContent *> channels;
    UserList aUserList;
};

#endif // CHANNEL_H
