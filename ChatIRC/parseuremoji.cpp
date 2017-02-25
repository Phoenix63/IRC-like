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
                message->addWidget(new QLabel(string.left(index)));
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
    message->addWidget(new QLabel(string));
    message->addStretch(0);
    return message;
}
