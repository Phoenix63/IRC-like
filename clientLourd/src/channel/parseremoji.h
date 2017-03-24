#ifndef CHANNEL_PARSEUREMOJI_H
#define CHANNEL_PARSEUREMOJI_H

#include <QHash>
#include <QPixmap>
#include <QString>

template <typename,typename>
class QHash;
template <typename>
class QList;

class QDir;
class QLabel;
class QRegularExpression;
class QSpacerItem;

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
