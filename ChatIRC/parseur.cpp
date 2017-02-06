#include "parseur.h"

QString * Parseur::parse(QString *string)
{
    if      (string->startsWith("/nick"))  string->replace(QString("/nick"), QString("NICK"));
    else if (string->startsWith("/user"))  string->replace(QString("/user"), QString("USER"));
    else if (string->startsWith("/join"))  string->replace(QString("/join"), QString("JOIN"));
    else if (string->startsWith("/names")) string->replace(QString("/names"), QString("NAMES"));
    else if (string->startsWith("/part"))  string->replace(QString("/part"), QString("PART"));
    else if (string->startsWith("/list"))  string->replace(QString("/list"), QString("LIST"));
    else if (string->startsWith("/quit"))  string->replace(QString("/quit"), QString("QUIT"));
    else if (string->contains("/who"))     string->replace(QString("/who"), QString("WHO"));
    else                                   string->prepend("PRIVMSG ");

    return string;
}
