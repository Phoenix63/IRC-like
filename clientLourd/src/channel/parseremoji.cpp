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
    if (string.contains(QRegularExpression("[http|https]://")))
        string = parseURL(string);
    else
        string.toHtmlEscaped().replace("&amp;","&").replace("&quot;","\"\"").replace("&gt;",">");
    for(auto  i : emotes.keys()) {
        QByteArray* byteArray = new QByteArray();
        QBuffer buffer(byteArray);
        emotes[i].save(&buffer, "PNG");
        string.replace(i, "<img src=\"data:ressources/image/png;base64," + byteArray->toBase64() + ".png\" height=\"20\" />");
    }
    return string;
}

QString ParserEmoji::parseURL(QString string)
{
    int j = string.indexOf(QRegularExpression("[http://|https://]"));
    QString left = string.left(j);
    QString rest = string.right(string.length() - j);
    QStringList tmp = rest.split(' ');
    QString url = tmp.at(0);
    tmp.removeFirst();
    QString right = tmp.join(' ');
    QString link = url;
    url.prepend("<a href=\"");
    url.append("\"style=\"text-decoration: none;\">" + link + "</a>");
    return left + ' ' + url + ' ' + right;
}

QList<QString> ParserEmoji::keys()
{
    return emotes.keys();
}

QPixmap ParserEmoji::value(QString key)
{
    return emotes[key];
}
