#include "parseuremoji.h"

ParseurEmoji::ParseurEmoji():
    smile("img/smile.png")
{
    smile = smile.scaled(15, 15, Qt::KeepAspectRatio,Qt::SmoothTransformation);
}

QHBoxLayout * ParseurEmoji::parse(QString string)
{
    QHBoxLayout *message = new QHBoxLayout;
    auto count = string.count(QRegularExpression(":\\S+:"));
    auto index = 0;
    for (auto i = 0; i < count; i++ ) {
        index = string.indexOf(QRegularExpression(":\\S+:"), index);
        QString tmp = string.right(string.length() - index);
        if (tmp.startsWith(":smile:")) {
            tmp = string.left(index);
            message->addWidget(new QLabel(string.left(index)));
            index += 7;
            string = string.right(string.length() - index);
            QLabel *label = new QLabel;
            label->setPixmap(smile);
            message->addWidget(label);
            index = 0;
        } else {
            index++;
        }
    }
    message->addWidget(new QLabel(string));
    message->addStretch(0);
    return message;
}
