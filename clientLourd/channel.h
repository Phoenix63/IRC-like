#ifndef CHANNEL_H
#define CHANNEL_H

#include <QString>
#include <QHash>

#include "parseremoji.h"
#include "channelcontent.h"

template<typename> class QList;
class QListWidget;
class QTextBrowser;
class QLineEdit;
class QColor;
class QVBoxLayout;
class QLabel;
class QTime;

class Channel
{
public:
    // Constructor
    Channel();

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
    void clean();

    // Current channel change function
    void change(QString newChannel);

    // Current channel name getter
    QString channelName();
    QList<QString> channelNames();

    // User functions
    void addUser(QString user, QString channel);
    void delUser(QString user, QString channel);
    void changeNick(QString nick, QString newNick);
    QList<QString> users();

    // Topic
    void topic(QString topic, QString channel);
    QString topic();

    //Notifications
    bool notif(QString chan);
    void togleNotif(QString chan);
private:
    // Current channel name
    QString currentChannel;
    // Qhash wich contain message: key = channel name, content = message list
    QHash<QString, ChannelContent> channels;

};

#endif // CHANNEL_H
