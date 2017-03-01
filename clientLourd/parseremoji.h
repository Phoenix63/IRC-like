#ifndef PARSEUREMOJI_H
#define PARSEUREMOJI_H

#include <QString>
#include <QHBoxLayout>
#include <QHash>
#include <QPixmap>

class QLabel;
class QSpacerItem;
class QRegularExpression;
template <typename,typename>
class QHash;
class QDir;

class ParserEmoji
{

public:
    ParserEmoji();
    QList<QHBoxLayout *> parse(QString heure,QString pseudo,QString string);
    QHash<QString, QPixmap> * getHashMap();

private:
    QHash<QString,QPixmap> emotes;
    QPixmap smile;
    QPixmap pandab;
};

#endif // PARSEUREMOJI_H
