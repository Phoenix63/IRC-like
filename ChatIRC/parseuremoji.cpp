#include "parseuremoji.h"

ParseurEmoji::ParseurEmoji():
    smile("img/smile.jpg")
{
    smile = smile.scaled(15, 15, Qt::KeepAspectRatio,Qt::SmoothTransformation);
}

QHBoxLayout * ParseurEmoji::parse(QString string)
{
    QHBoxLayout *message = new QHBoxLayout;
    QString msg;
    for (auto i:string.split(' ')) {
        if (i == ":smile:") {
            if (msg != "")
                message->addWidget(new QLabel(msg));
            msg = "";
            QLabel *label = new QLabel;
            label->setPixmap(smile);
            message->addWidget(label);
        } else {
            msg.append(" " + i);
        }
    }
    if (msg != "")
        message->addWidget(new QLabel(msg));
    message->addStretch(0);
    return message;
}
