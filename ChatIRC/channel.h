#ifndef CHANNEL_H
#define CHANNEL_H

#include <QString>
#include <QHash>
#include <QTcpSocket>
#include <QListWidget>

class Channel
{
private:
    QListWidget *chanList;
    QString *current;
    QHash<QString, QString> channels;
public:
    Channel();
    void change(QString newChannel);
    QString * text();
    void append(QString channel, QString text);
    void add(QString newChannel);
    void update(QString string);
    void setQList();
    void setList(QListWidget *list);
};

#endif // CHANNEL_H
