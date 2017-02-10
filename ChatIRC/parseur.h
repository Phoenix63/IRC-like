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
};

class In {
private:
public:
    QString * parse(QString *string);
};
}

#endif // PARSEUR_H
