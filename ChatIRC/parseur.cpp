#include "parseur.h"
#include <QDebug>
#include <QRegExp>
#include <QRegularExpression>

/*
 * Parseur::Out: parse client request
 */

QString * Parseur::Out::parse(QString *string, QString channel)
{
    emit send_request_signal(*string);
    if      (string->startsWith("/nick"))  string->replace(QString("/nick"), QString("NICK"));
    else if (string->startsWith("/user"))  string->replace(QString("/user"), QString("USER"));
    else if (string->startsWith("/join"))  string->replace(QString("/join"), QString("JOIN"));
    else if (string->startsWith("/names")) string->replace(QString("/names"), QString("NAMES"));
    else if (string->startsWith("/part"))
    {
        string->replace(QString("/part"), QString("PART"));
        emit leave_channel_signal(string->left(string->length() - 1));
    }
    else if (string->startsWith("/list"))  string->replace(QString("/list"), QString("LIST"));
    else if (string->startsWith("/quit"))
    {
        emit quit_signal();
        string->replace(QString("/quit"), QString("QUIT"));
    }
    else if (string->startsWith("/who"))     string->replace(QString("/who"), QString("WHO"));
    else if (string->startsWith("/msg"))
    {
        string->replace(QString("/msg"), QString("PRIVMSG"));
        emit send_whisper_signal(string->split(' ').at(1));
    }
    else if (channel != "\"Debug\"")   string->prepend("PRIVMSG " + channel + " :");
    else                                string->prepend("PRIVMSG ");

    return string;
}

/*
 * Parseur::In: parse server response
 */

void Parseur::In::parse(QString string)
{
    // Get rid of spaces and \n
    string = string.left(string.length() - 1);
    string = string.right(string.length() - 2);

    //Parse the message starting from error code to detect server name
    int i = string.indexOf(' ');
    QString cmd = string.right(string.length() - i - 1);


    //Joining a channel
    if (cmd.contains(QRegularExpression("^331|332")))
        emit join_channel_signal(cmd);


    //When receive a message in a channel
    else if (cmd.contains(QRegularExpression("^PRIVMSG\\s#.+\\s:.+$")))
    {
        int j = cmd.indexOf(QRegularExpression(":.+$"));
        emit response_signal(cmd.right(cmd.length()-j)+'\n', cmd.split(' ').at(1),string.split(' ').at(0));
    }


    //When receiving a whisper
    else if (cmd.contains(QRegularExpression("^PRIVMSG\\s.+\\s:.+$")))
    {
        int j = cmd.indexOf(QRegularExpression(":.+$"));
        emit response_signal(cmd.right(cmd.length()-j)+'\n', string.split(' ').at(0),string.split(' ').at(0));
    }


    //Commands like /nick, /part, /list, /names etc
    else
        emit response_signal(cmd+'\n', "\"Debug\"","");
}
