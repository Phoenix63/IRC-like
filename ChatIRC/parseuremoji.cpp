#include "parseuremoji.h"

ParseurEmoji::ParseurEmoji()
{
    QDir emojis("img/");
    QStringList emojisList = emojis.entryList();
    for(auto i:emojisList)
    {
        QPixmap j("img/"+i);
        i=i.left(i.length()-4);
        emotes[":"+i+":"] = j.scaled(15, 15, Qt::KeepAspectRatio,Qt::SmoothTransformation);
    }
}

QHBoxLayout * ParseurEmoji::parse(QString string)
{
    QHBoxLayout *message = new QHBoxLayout;
    message->setSpacing(2);
    auto count = string.count(QRegularExpression(":\\S+:"));
    auto index = 0;
    for (auto i = 0; i < count; i++ )
    {
        bool modified = false;
        index = string.indexOf(QRegularExpression(":\\S+:"), index);
        QString tmp = string.right(string.length() - index);
        for(auto  i :emotes.keys())
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
                modified=true;
                break;
            }
        }
        if(!modified) index++;
    }
    QLabel *textLabel = new QLabel(string);
    textLabel->setTextInteractionFlags(Qt::TextSelectableByMouse);
    message->addWidget(textLabel);
    message->addStretch(0);
    return message;
}
