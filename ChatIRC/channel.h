#ifndef CHANNEL_H
#define CHANNEL_H

#include <QString>
#include <QHash>
#include <QTcpSocket>
#include <QListWidget>
#include "parseur.h"

class Channel : public QObject {
    Q_OBJECT
private:
    QListWidget *chanList;
    QString *current;
    QHash<QString, QString> channels;
    Parseur::In *parseur_in;
    Parseur::Out *parseur_out;

public:
    Channel();
    void change(QString newChannel);
    QString * text();
    void append(QString channel, QString text);
    void join(QString newChannel);
    void leave(QString channel);
    void setQList();
    void setList(QListWidget *list);
    void setParseurIn(Parseur::In *parseur);
    void setParseurOut(Parseur::Out *parseur);
public slots:
     void update(QString string);
};

#endif // CHANNEL_H
