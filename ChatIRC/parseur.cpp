#include "parseur.h"

#include <QDebug>
#include <QRegExp>
#include <QRegularExpression>

/*
 * Parseur: Initialisation functions
 */

void Parseur::setChannel(Channel *chan)
{
    channel = chan;
}

/*
 * Parse::Out: Parse client request
 */

bool Parseur::out(QString *string)
{
    channel->appendCurrent(*string);
    if      (string->startsWith("/nick"))  string->replace(QString("/nick"), QString("NICK"));
    else if (string->startsWith("/user"))  string->replace(QString("/user"), QString("USER"));
    else if (string->startsWith("/join"))  string->replace(QString("/join"), QString("JOIN"));
    else if (string->startsWith("/names")) string->replace(QString("/names"), QString("NAMES"));
    else if (string->startsWith("/pass")) string->replace(QString("/pass"), QString("PASS"));
    else if (string->startsWith("/part"))
        {
            string->replace(QString("/part"), QString("PART"));
            if(string->contains(QRegularExpression("^PART\\s*$"))){
                *string="PART "+channel->channelName()+'\n';
                channel->leave(channel->channelName());
            }
            else
            {
                qDebug() << *string << " , "<< string->split(' ').at(1);
                channel->leave(string->split(' ').at(1).left(string->split(' ').at(1).length()-1));
            }
        }
    else if (string->startsWith("/list"))  string->replace(QString("/list"), QString("LIST"));
    else if (string->startsWith("/quit"))
    {
        string->replace(QString("/quit"), QString("QUIT"));
        return false;
    }
    else if (string->startsWith("/who"))     string->replace(QString("/who"), QString("WHO"));
    else if (string->startsWith("/msg"))
    {
        string->replace(QString("/msg"), QString("PRIVMSG"));
        channel->joinWhisper(string->split(' ').at(1));
    }
    else if (channel->channelName() != "\"Debug\"")   string->prepend("PRIVMSG " + channel->channelName() + " :");
    else                                              string->prepend("PRIVMSG ");
    return true;
}

/*
 * Parseur::in: Parse server response
 */

void Parseur::in(QString string)
{
    // Get rid of spaces and \n
    string = string.left(string.length() - 1);
    string = string.right(string.length() - 2);

    //Parse the message starting from error code to detect server name
    if (!in_isChanList(string))
    if (!in_isNameList(string))
    if (!in_isJoinNote(string))
    if (!in_isPartNote(string))
    if (!in_isPrivMesg(string))
    if (!in_isWhisMesg(string))
    if (!in_isPing(string))
    channel->appendChannel(string+'\n', "\"Debug\"","");
}

bool Parseur::in_isChanList(QString string)
{
    int i = string.indexOf(QRegularExpression(":.+$"));
    if (string.contains(QRegularExpression("^.+\\s(331|332)")))
        channel->join(string.split(' ')[3], string.right(string.length()-i - 1));
    else
        return false;
    return true;
}


bool Parseur::in_isNameList(QString string)
{
    if (string.contains(QRegularExpression("^.+\\s353"))) {
        channel->appendChannel(string+'\n', "\"Debug\"","");
        for (auto i = 5; i < string.split(QRegularExpression("\\s:?")).length(); i++) {
            channel->addUser(string.split(QRegularExpression("\\s:?"))[i],string.split(QRegularExpression("\\s:?"))[4]);
        }
    } else {
        return false;
    }
    return true;

}

bool Parseur::in_isJoinNote(QString string)
{
    if (string.contains(QRegularExpression("^.+\\sJOIN\\s#.+$"))) {
        channel->appendChannel(string+'\n', "\"Debug\"","");
        channel->addUser(string.split(' ')[0], string.split(' ')[2]);
    } else {
        return false;
    }
    return true;
}

bool Parseur::in_isPartNote(QString string)
{
    if (string.contains(QRegularExpression("^.+\\sPART\\s#.+$"))) {
        channel->appendChannel(string+'\n', "\"Debug\"","");
        channel->delUser(string.split(' ')[0], string.split(' ')[2]);
    } else {
        return false;
    }
    return true;
}

bool Parseur::in_isPrivMesg(QString string)
{
    if (string.contains(QRegularExpression("^.+\\sPRIVMSG\\s#.+\\s:.+$")))
    {
        int j = string.indexOf(QRegularExpression(":.+$"));
        channel->appendChannel(string.right(string.length()-j)+'\n', string.split(' ').at(2),string.split(' ').at(0));
    } else {
        return false;
    }
    return true;
}

bool Parseur::in_isWhisMesg(QString string)
{
    if (string.contains(QRegularExpression("^.+\\sPRIVMSG\\s.+\\s:.+$")))
    {
        int j = string.indexOf(QRegularExpression(":.+$"));
        channel->appendChannel(string.right(string.length()-j)+'\n', string.split(' ').at(0),string.split(' ').at(0));
    } else {
        return false;
    }
    return true;
}

bool Parseur::in_isPing(QString string)
{
    if(string.contains(QRegularExpression("^PING\\s:.+$")))
    {
        int j = string.indexOf(QRegularExpression(":.+$"));
        QString pong = string.right(string.length()-j)+'\n';
        pong.prepend("PONG ");
        socket->write(pong.toLatin1().data());
            return false;
    }
            return true;
}
