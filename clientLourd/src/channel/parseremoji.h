#ifndef CHANNEL_PARSEUREMOJI_H
#define CHANNEL_PARSEUREMOJI_H

#include <QString>
#include <QHash>
#include <QPixmap>

template <typename> class QList;

class QLabel;
class QSpacerItem;
class QRegularExpression;
template <typename,typename>
class QHash;
template <typename> class QList;
class QDir;

class ParserEmoji
{

public:
    ParserEmoji();
    QString parse(QString string);
    QString parseURL(QString string);
    QHash<QString, QPixmap> * getHashMap();
    QList<QString> keys();
    QPixmap value(QString key);

private:
    QHash<QString,QPixmap> emotes;
    QPixmap smile;
    QPixmap pandab;
};

#endif // PARSEUREMOJI_H
