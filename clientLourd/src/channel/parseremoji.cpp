#include "parseremoji.h"

#include <QBuffer>
#include <QDir>
#include <QLabel>
#include <QRegularExpression>
#include <QStringList>

#include "../config/theme.h"

ParserEmoji::ParserEmoji()
{
    QDir emojis("ressources/img/emojis/");
    QStringList emojisList = emojis.entryList();
    for(auto i:emojisList)
    {
        if (i == "." || i == "..")
            continue;
        QPixmap j("ressources/img/emojis/" + i);
        i = i.left(i.length() - 4);
        emotes[":" + i + ":"] = j.scaledToHeight(20, Qt::SmoothTransformation);
    }
}

QString ParserEmoji::parse(QString string)
{
	//TODO recuperer les mentions sur soi + jouer AH.wav + notifications
    for(auto  i : emotes.keys()) {
        QByteArray* byteArray = new QByteArray();
        QBuffer buffer(byteArray);
        emotes[i].save(&buffer, "PNG");
        string.replace(i, "<img src=\"data:ressources/image/png;base64," + byteArray->toBase64() + ".png\" height=\"20\" />");
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
