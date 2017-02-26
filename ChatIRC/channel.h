#ifndef CHANNEL_H
#define CHANNEL_H

#include <QString>
#include <QHash>
#include <QListWidget>
#include <QTextBrowser>
#include <QLineEdit>
#include <QColor>
#include <QList>
#include <QVBoxLayout>
#include <QLabel>
#include <QTime>

#include "parseuremoji.h"
#include "channelcontent.h"

class Channel {
public:
    // Constructor
    Channel();

    // Initialisation functions
    void setUi(QListWidget *list, QVBoxLayout *text, QListWidget *uList, QLineEdit *tText, QLineEdit *mText, QVBoxLayout *nText);

    // Channel creation functions
    void join(QString chan, QString topic);
    void joinWhisper(QString dest);

    // UI statues update functions
    void refreshText();
    void refreshChanList();

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
    void refreshUserList();

    void refreshTopic();
    void changeNick(QString nick, QString newNick);

    void clean();
    void clearLayout(QLayout *layout);
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
    ParseurEmoji parseur;

    // Current channel name
    QString currentChannel;
};

#endif // CHANNEL_H
