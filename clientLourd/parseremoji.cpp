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
        emotes[":" + i + ":"] = j.scaledToHeight(20, Qt::SmoothTransformation);
    }
}

QList<QHBoxLayout *> ParserEmoji::parse(QString heure, QString pseudo, QString string)
{
    QHBoxLayout *pseudoBox = new QHBoxLayout;
    QHBoxLayout *message = new QHBoxLayout;
    pseudoBox->setSpacing(2);
    message->setSpacing(2);
    auto count = string.count(QRegularExpression(":\\S+:"));
    auto index = 0;
    QLabel *LHeure = new QLabel(heure);
    LHeure->setStyleSheet(IRC::COLOR::LIGHT::HOUR);
    pseudoBox->addWidget(LHeure);
    QLabel *lPseudo= new QLabel(pseudo);
    lPseudo->setStyleSheet(IRC::COLOR::LIGHT::NAME);
    pseudoBox->addWidget(lPseudo);

    for (auto i = 0; i < count; i++ )
    {
        bool modified = false;
        index = string.indexOf(QRegularExpression(":\\S+:"), index);
        QString tmp = string.right(string.length() - index);
        for(auto  i : emotes.keys())
        {
            if (tmp.startsWith(i))
            {
                tmp = string.left(index);
                QLabel *textLabel = new QLabel(string.left(index));
                textLabel->setTextInteractionFlags(Qt::TextSelectableByMouse);
                message->addWidget(textLabel);
                index += i.length();
                string = string.right(string.length() - index);
                QLabel *label = new QLabel;
                label->setPixmap(emotes[i]);
                message->addWidget(label);
                index = 0;
                modified = true;
                break;
            }
        }
        if(!modified) index++;
    }
    QLabel *textLabel = new QLabel(string);
    textLabel->setTextInteractionFlags(Qt::TextSelectableByMouse);
    message->addWidget(textLabel);
    message->addStretch(0);
    pseudoBox->setAlignment(Qt::AlignLeft);
    QList<QHBoxLayout *> ret;
    ret << pseudoBox << message;
    return ret;
}

QHash<QString, QPixmap> * ParserEmoji::getHashMap()
{
    return &emotes;
}

