#ifndef PARSEUR_H
#define PARSEUR_H

#include <QString>
#include <QObject>

namespace Parseur {

/*
 * Parseur::Out: parse server response
 */
class Out : public QObject {
    Q_OBJECT
private:
public:
    QString * parse(QString *string, QString channel);
signals:
    void quit_signal();
    void leave_channel_signal(QString channel);
    void send_request_signal(QString string);
    void send_whisper_signal(QString dest);
};

/*
 * Parseur::In: parse client request
 */
class In : public QObject {
    Q_OBJECT
private:
public:
    void parse(QString string);
signals:
    void join_channel_signal(QString);
    void response_signal(QString string, QString channel,QString send);
};
}

#endif // PARSEUR_H
