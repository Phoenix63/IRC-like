#ifndef PARSEUREMOJI_H
#define PARSEUREMOJI_H

#include <QPixmap>
#include <QLabel>
#include <QString>
#include <QHBoxLayout>
#include <QSpacerItem>
#include <QRegularExpression>
#include <QDebug>
#include <QHash>
#include <QDir>

class ParseurEmoji
{

public:
    ParseurEmoji();

    QHBoxLayout *parse(QString string);

private:
    // soon a hash map for easy config from file
    QHash<QString,QPixmap> emotes;
    QPixmap smile;
    QPixmap pandab;
};

#endif // PARSEUREMOJI_H
