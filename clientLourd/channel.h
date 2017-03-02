#ifndef CHANNEL_H
#define CHANNEL_H

#include "parseremoji.h"
#include "channelcontent.h"

#include <QString>
#include <QHash>
#include <QList>

class QListWidget;
class QTextBrowser;
class QLineEdit;
class QColor;
class QVBoxLayout;
class QLabel;
class QTime;

class Channel {
public:
    // Constructor
    Channel();

    // Initialisation functions
    void setUi(QListWidget *list, QVBoxLayout *text, QListWidget *uList, QLineEdit *tText, QLineEdit *mText, QVBoxLayout *nText);

    // Channel creation functions
    void join(QString chan, QString topic);
    void joinWhisper(QString dest);

    // UI update functions
    void refreshText();
    void refreshChanList();
    void clearContent();
    void refreshTopic();
    void refreshUserList();
    void clean();
    void clearLayout(QLayout *layout);

    // Channel quit functions
    void leave(QString channel);

    // Text adding function
    void appendChannel(QString string, QString channel, QString send);
    void appendCurrent(QString string);

    // Current channel change function
    void change(QString newChannel);

    // Current channel name getter
    QString channelName();

    // User functions
    void addUser(QString user, QString channel);
    void delUser(QString user, QString channel);
    void changeNick(QString nick, QString newNick);

    // Topic
    void setTopic(QString topic, QString channel);


    QHash<QString, QPixmap> * getHashMap();
private:
    // Qhash wich contain message: key = channel name, content = message list
    QHash<QString, ChannelContent> channels;

    // UI for interface update
    QListWidget *chanList;
    QVBoxLayout *chanText;
    QVBoxLayout *nickText;
    QListWidget *userList;
    QLineEdit *topicText;
    QLineEdit *messageText;
    ParserEmoji parser;

    // Current channel name
    QString currentChannel;
};

#endif // CHANNEL_H
