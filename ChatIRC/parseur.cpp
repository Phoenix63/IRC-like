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

void Parseur::setSocket(QTcpSocket *sock){
    socket = sock;
}

bool Parseur::out(QString string)
{
    string.append('\n');
    if (out_isQuitMsg(string))
        return false;
    if (!out_isNickMsg(string))
    if (!out_isUserMsg(string))
    if (!out_isJoinMsg(string))
    if (!out_isNamesMsg(string))
    if (!out_isPassMsg(string))
    if (!out_isPartMsg(string))
    if (!out_isListMsg(string))
    if (!out_isWhoMsg(string))
    if (!out_isWhoisMsg(string))
    if (!out_isMsgMsg(string))
    if (!out_isPrivMsg(string))
        return false;
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
    if (!in_isNickEdit(string))
    if (!in_isPing(string))
        channel->appendChannel(string+'\n', "\"Debug\"","");
}

/*
 * Parseur: Out private function's
 */

bool Parseur::out_isNickMsg(QString string)
{
    if (!string.startsWith("/nick"))
        return false;
    string.replace(QString("/nick"), QString("NICK"));
    socket->write(string.toLatin1().data());
    return true;
}

bool Parseur::out_isUserMsg(QString string)
{
    if (!string.startsWith("/user"))
        return false;
    string.replace(QString("/user"), QString("USER"));
    socket->write(string.toLatin1().data());
    return true;
}

bool Parseur::out_isJoinMsg(QString string)
{
    if (!string.startsWith("/join"))
        return false;
    string=string.right(string.length()-5);
    string.prepend("JOIN");
    socket->write(string.toLatin1().data());
    return true;
}

bool Parseur::out_isNamesMsg(QString string)
{
    if(!string.startsWith("/names"))
        return false;
    string=string.right(string.length()-6);
    string.prepend("NAMES");
    socket->write(string.toLatin1().data());
    return true;
}

bool Parseur::out_isPassMsg(QString string)
{
    if (!string.startsWith("/pass"))
        return false;
    string=string.right(string.length()-5);
    string.prepend("PASS");
    socket->write(string.toLatin1().data());
    return true;
}

bool Parseur::out_isPartMsg(QString string)
{
    if (!string.startsWith("/part"))
        return false;
    string=string.right(string.length()-5);
    string.prepend("PART");
    if (string.contains(QRegularExpression("^PART\\s*$"))) {
        string="PART "+channel->channelName()+'\n';
        channel->leave(channel->channelName());
    } else {
        channel->leave(string.split(' ').at(1).left(string.split(' ').at(1).length()-1));
    }
    socket->write(string.toLatin1().data());
    return true;
}

bool Parseur::out_isListMsg(QString string)
{
    if (!string.startsWith("/list"))
        return false;
    string.replace(QString("/list"), QString("LIST"));
    socket->write(string.toLatin1().data());
    return true;
}

bool Parseur::out_isWhoMsg(QString string)
{
    if(!string.startsWith("/who "))
        return false;
    string=string.right(string.length()-4);
    string.prepend("WHO");
    if (channel->channelName() != "\"Debug\"")
        string = QString("WHO "+ (channel->channelName()) +'\n');
    socket->write(string.toLatin1().data());
    return true;
}

bool Parseur::out_isWhoisMsg(QString string)
{
    if (!string.startsWith("/whois"))
        return false;
    string=string.right(string.length()-5);
    string.prepend("WHOIS");
    socket->write(string.toLatin1().data());
    return true;
}

bool Parseur::out_isMsgMsg(QString string)
{
    if (!string.startsWith("/msg"))
        return false;
    string.replace(QString("/msg"), QString("PRIVMSG"));
    channel->joinWhisper(string.split(' ').at(1));
    channel->change(string.split(' ').at(1));
    socket->write(string.toLatin1().data());
    int j = string.indexOf(QRegularExpression(":.+$"));
    channel->appendCurrent("You : "+string.right(string.length()-j-1)+'\n');
    return true;
}

bool Parseur::out_isPrivMsg(QString string)
{
    channel->appendCurrent("You : "+string);
    string.prepend("PRIVMSG "+ channel->channelName() + " :");
    socket->write(string.toLatin1().data());
        return true;
}

bool Parseur::out_isQuitMsg(QString string)
{
    if (!string.startsWith("/quit"))
            return false;
    string.replace(QString("/quit"), QString("QUIT"));
    socket->write(string.toLatin1().data());
    return true;
}

/*
 * Parseur: In private function's
 */

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
    if (!string.contains(IRC::RPL::JOIN))
        return false;
    channel->appendChannel(string+'\n', "\"Debug\"","");
    channel->addUser(string.split(' ')[0], string.split(' ')[2]);
    return true;
}

bool Parseur::in_isPartNote(QString string)
{
    if (!string.contains(IRC::RPL::PART))
            return false;
    channel->appendChannel(string+'\n', "\"Debug\"","");
    channel->delUser(string.split(' ')[0], string.split(' ')[2]);
    return true;
}

bool Parseur::in_isPrivMesg(QString string)
{
    if (!string.contains(IRC::RPL::PRIVMSG))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    channel->appendChannel(string.right(string.length()-j)+'\n', string.split(' ').at(2),string.split(' ').at(0));
    return true;
}

bool Parseur::in_isWhisMesg(QString string)
{
    if (!string.contains(IRC::RPL::WHISPER))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString sender = string.split(' ').at(0);
    channel->joinWhisper(sender);
    channel->appendChannel(string.right(string.length()-j)+'\n', string.split(' ').at(0),sender);
    return true;
}

bool Parseur::in_isNickEdit(QString string)
{
    if (!string.contains(IRC::RPL::NICK))
        return false;
    channel->changeNick(string.split(' ')[0], string.split(' ')[2]);
    channel->appendChannel(string+'\n', "\"Debug\"","");
    return true;
}

bool Parseur::in_isPing(QString string)
{
    if(!string.contains(IRC::RPL::PING))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString pong = string.right(string.length()-j)+'\n';
    pong.prepend("PONG ");
    socket->write(pong.toLatin1().data());
    return true;
}
