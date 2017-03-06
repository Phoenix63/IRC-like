#include "parseremoji.h"
#include "theme.h"

#include <QDir>
#include <QStringList>
#include <QRegularExpression>
#include <QLabel>

ParserEmoji::ParserEmoji()
{
    QDir emojis("img/emojis/");
    QStringList emojisList = emojis.entryList();
    for(auto i:emojisList)
    {
        if (i == "." || i == "..")
            continue;
        QPixmap j("img/emojis/" + i);
        i = i.left(i.length() - 4);
        emotes[":"+i+":"] = j.scaledToHeight(20, Qt::SmoothTransformation);
    }
}

QString ParserEmoji::parse(QString string)
{
    for(auto  i : emotes.keys()) {
        QByteArray* byteArray = new QByteArray();
        QBuffer buffer(byteArray);
        emotes[i].save(&buffer, "PNG");
        string.replace(i, "<img src=\"data:image/png;base64," + byteArray->toBase64()+".png\" height=\"20\" />");
    }
    return string;
}

QList<QString> ParserEmoji::keys()
{
    return emotes.keys();
}

QPixmap ParserEmoji::value(QString key)
{
    return emotes[key];
}
