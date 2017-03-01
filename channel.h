#ifndef CHANNEL_H
#define CHANNEL_H

#include "parseremoji.h"
#include "channelcontent.h"

#include <QString>
#include <QHash>
#include <QList>
<<<<<<< HEAD
=======
#include <QVBoxLayout>
#include <QLabel>

>>>>>>> origin/ClientLourd

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
    void setUi(QListWidget *list, QVBoxLayout *text, QListWidget *uList, QLineEdit *tText);

    // Channel creation functions
    void join(QString chan, QString topic);
    void joinWhisper(QString dest);

    // UI update functions
    void refreshText();
    void refreshChanList();
<<<<<<< HEAD
    void clearContent();
    void refreshTopic();
    void refreshUserList();
    void clean();
    void clearLayout(QLayout *layout);
=======
>>>>>>> origin/ClientLourd

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

<<<<<<< HEAD
    QHash<QString, QPixmap> * getHashMap();
=======
    void clean();
    void clearLayout(QLayout *layout);

>>>>>>> origin/ClientLourd
private:
    // Qhash wich contain message: key = channel name, content = message list
    QHash<QString, ChannelContent> channels;

    // UI for interface update
    QListWidget *chanList;
    QVBoxLayout *chanText;
    QListWidget *userList;
    QLineEdit *topicText;
<<<<<<< HEAD
    QLineEdit *messageText;
    ParserEmoji parser;
=======
>>>>>>> origin/ClientLourd

    // Current channel name
    QString currentChannel;
    ParseurEmoji parseur;
};

#endif // CHANNEL_H
