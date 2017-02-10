#include "parseur.h"
#include <QDebug>


QString * Parseur::Out::parse(QString *string)
{
    if      (string->startsWith("/nick"))  string->replace(QString("/nick"), QString("NICK"));
    else if (string->startsWith("/user"))  string->replace(QString("/user"), QString("USER"));
    else if (string->startsWith("/join"))  string->replace(QString("/join"), QString("JOIN"));
    else if (string->startsWith("/names")) string->replace(QString("/names"), QString("NAMES"));
    else if (string->startsWith("/part"))
    {
        string->replace(QString("/part"), QString("PART"));
        int i = string->indexOf(' ');
        QString chan = string->right(string->length() - i - 1);
        emit leave_channel_signal(chan);
    }
    else if (string->startsWith("/list"))  string->replace(QString("/list"), QString("LIST"));
    else if (string->startsWith("/quit"))
    {
        emit quit_signal();
        string->replace(QString("/quit"), QString("QUIT"));
    }
    else if (string->contains("/who"))     string->replace(QString("/who"), QString("WHO"));
    else                                   string->prepend("PRIVMSG ");

    return string;
}

QString * Parseur::In::parse(QString *string)
{
    if (string->startsWith("331") || string->startsWith("332"))
            emit channel_add_signal(*string);
    return string;
}
