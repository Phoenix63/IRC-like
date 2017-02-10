#ifndef PARSEUR_H
#define PARSEUR_H

#include <QString>
#include <QObject>

namespace Parseur {

class Out : public QObject {
    Q_OBJECT
private:
public:
    QString * parse(QString *string);
signals:
    void quit_signal();
    void leave_channel_signal(QString channel);
};

class In : public QObject {
    Q_OBJECT
private:
public:
    QString * parse(QString *string);
signals:
    void channel_add_signal(QString);
};
}

#endif // PARSEUR_H
