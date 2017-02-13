#ifndef CHANNEL_H
#define CHANNEL_H

#include <QString>
#include <QHash>
#include <QListWidget>
#include <QTextBrowser>
#include <QLineEdit>
#include <QColor>
#include <QList>

class Channel {
public:
    // Constructor
    Channel();

    // Initialisation functions
    void setUi(QListWidget *list, QTextBrowser *text, QListWidget *uList, QLineEdit *tText);

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

private:
    // Qhash wich contain message: key = channel name, content = message list
    QHash<QString, QString> channels;
    QHash<QString, QList<QString>> users;
    QHash<QString, QString> topics;

    // UI for interface update
    QListWidget *chanList;
    QTextBrowser *chanText;
    QListWidget *userList;
    QLineEdit *topicText;

    // Current channel name
    QString currentKey;

    // Pointer on current channel content for les Hash map loop
    QString *current;
    QList<QString> *currentList;
    QString *currentTopic;
};

#endif // CHANNEL_H
