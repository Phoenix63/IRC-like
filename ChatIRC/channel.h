#ifndef CHANNEL_H
#define CHANNEL_H

#include <QString>
#include <QHash>
#include <QTcpSocket>
#include <QListWidget>
#include <QTextBrowser>
#include "parseur.h"

class Channel : public QObject {
    Q_OBJECT
private:
/*
 * Channel: widget pointer for easyer draw handling
 */
    QListWidget *chanList;
    QTextBrowser *chanText;

/*
 * Channel: Current pointer and key to bypass hash search
 */
    QString currentKey;
    QString *current;

/*
 * Channel: hash map wich contain channel list and their content
 * the key is the channel name
 */
    QHash<QString, QString> channels;

/*
 * Channel: parser pointer to handle parsing signal
 */
    Parseur::In *parseur_in;
    Parseur::Out *parseur_out;

public:
    Channel();

/*
 * Channel: initialisation's function
 */
    void setList(QListWidget *list);
    void setChanText(QTextBrowser *text);
    void setParseurIn(Parseur::In *parseur);
    void setParseurOut(Parseur::Out *parseur);

/*
 * Channel: State update
 */
    void change(QString newChannel);

/*
 * Channel: State ui refresh
 */
    void refreshText();
    void refreshChanList();

public slots:
    void joinWhisper(QString dest);
    void join(QString string);
    void leave(QString channel);
    void appendCurrent(QString string);
    void appendChannel(QString string, QString channel, QString send);
};

#endif // CHANNEL_H
