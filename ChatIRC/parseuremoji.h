#ifndef PARSEUREMOJI_H
#define PARSEUREMOJI_H

#include <QPixmap>
#include <QLabel>
#include <QString>
#include <QHBoxLayout>
#include <QSpacerItem>
#include <QRegularExpression>
#include <QDebug>

class ParseurEmoji
{

public:
    ParseurEmoji();

    QHBoxLayout *parse(QString string);

private:
    // soon a hash map for easy config from file
    QPixmap smile;
};

#endif // PARSEUREMOJI_H
