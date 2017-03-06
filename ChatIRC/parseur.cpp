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

void Parseur::setSocket(QTcpSocket *sock)
{
    socket = sock;
}

void Parseur::setNickname(QString *nick)
{
    nickname = nick;
}
void Parseur::setChanList(Channellist *list)
{
    listOfChannels = list;
}

void Parseur::sendToServer(QTcpSocket *socket,QString string)
{
    socket->write(string.toUtf8());
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
    if (!out_isCleanMsg(string))
    if (!out_isDebugMsg(string))
    if (!out_isModeMsg(string))
    if (!out_isTopicMsg(string))
    if (!out_isKickMsg(string))
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
    if (!in_isListMesg(string))
    if (!in_isPing(string))
        channel->appendChannel(string+'\n', "\"Debug\"","");
}

/*
 * Parseur: Out private function's
 */

bool Parseur::out_isCleanMsg(QString string)
{
    if(!string.startsWith("/clean"))
        return false;
    channel->clearContent();
    channel->refreshText();
    return true;
}

bool Parseur::out_isDebugMsg(QString string)
{
    if(!string.startsWith("/debug"))
        return false;
    sendToServer(socket,string.right(string.length()-7));
    return true;
}

bool Parseur::out_isNickMsg(QString string)
{
    if (!string.startsWith("/nick"))
        return false;
    string.replace(QString("/nick"), QString("NICK"));
    sendToServer(socket,string);
    return true;
}

bool Parseur::out_isUserMsg(QString string)
{
    if (!string.startsWith("/user"))
        return false;
    string.replace(QString("/user"), QString("USER"));
    sendToServer(socket,string);
    return true;
}

bool Parseur::out_isJoinMsg(QString string)
{
    if (!string.startsWith("/join"))
        return false;
    string = string.right(string.length()-5);
    string.prepend("JOIN");
    sendToServer(socket,string);
    return true;
}

bool Parseur::out_isNamesMsg(QString string)
{
    if(!string.startsWith("/names"))
        return false;
    string = string.right(string.length()-6);
    string.prepend("NAMES");
    sendToServer(socket,string);
    return true;
}

bool Parseur::out_isPassMsg(QString string)
{
    if (!string.startsWith("/pass"))
        return false;
    string=string.right(string.length()-5);
    string.prepend("PASS");
    sendToServer(socket,string);
    return true;
}

bool Parseur::out_isPartMsg(QString string)
{
    if (!string.startsWith("/part"))
        return false;
    string = string.right(string.length()-5);
    string.prepend("PART");
    if (string.contains(QRegularExpression("^PART\\s*$"))) {
        string="PART "+channel->channelName()+'\n';
        channel->leave(channel->channelName());
    } else {
        channel->leave(string.split(' ').at(1).left(string.split(' ').at(1).length()-1));
    }
    sendToServer(socket,string);
    return true;
}

bool Parseur::out_isListMsg(QString string)
{
    if (!string.startsWith("/list"))
        return false;
    string.replace(QString("/list"), QString("LIST"));
    sendToServer(socket,string);
    listOfChannels->show();
    setChanList(listOfChannels);
    return true;
}

bool Parseur::out_isTopicMsg(QString string)
{
    if(!string.startsWith("/topic"))
        return false;
    string = string.right(string.length()-6);
    string.prepend("TOPIC");
    if (string.contains(QRegularExpression("^TOPIC\\s*$")))
        string="TOPIC "+channel->channelName()+'\n';
    sendToServer(socket,string);
    return true;
}

bool Parseur::out_isKickMsg(QString string)
{
    if (!string.startsWith("/kick"))
        return false;
    string = string.right(string.length()-5);
    string.prepend("KICK");
    sendToServer(socket,string);
    return true;
}

bool Parseur::out_isWhoMsg(QString string)
{
    if(!string.startsWith("/who "))
        return false;
    string = string.right(string.length()-4);
    string.prepend("WHO");
    if (channel->channelName() != "\"Debug\"")
        string = QString("WHO "+ (channel->channelName()) +'\n');
    sendToServer(socket,string);
    return true;
}

bool Parseur::out_isWhoisMsg(QString string)
{
    if (!string.startsWith("/whois"))
        return false;
    string = string.right(string.length()-6);
    string.prepend("WHOIS");
    sendToServer(socket,string);
    return true;
}

bool Parseur::out_isModeMsg(QString string)
{
    if (!string.startsWith("/mode"))
        return false;
    string = string.right(string.length()-5);
    string.prepend("MODE");
    sendToServer(socket,string);
    return true;
}

bool Parseur::out_isMsgMsg(QString string)
{
    if (!string.startsWith("/msg"))
        return false;
    string.replace(QString("/msg"), QString("PRIVMSG"));
    channel->joinWhisper(string.split(' ').at(1));
    channel->change(string.split(' ').at(1));
    sendToServer(socket,string);
    int j = string.indexOf(QRegularExpression(":.+$"));
    channel->appendCurrent(string.right(string.length()-j-1)+'\n');
    return true;
}

bool Parseur::out_isPrivMsg(QString string)
{
    channel->appendCurrent(string);
    string.prepend("PRIVMSG "+ channel->channelName() + " :");
    sendToServer(socket,string);
        return true;
}

bool Parseur::out_isQuitMsg(QString string)
{
    if (!string.startsWith("/quit"))
            return false;
    string.replace(QString("/quit"), QString("QUIT"));
    sendToServer(socket,string);
    return true;
}

/*
 * Parseur: In private function's
 */

bool Parseur::in_isChanList(QString string)
{
    int i = string.indexOf(QRegularExpression(":.+$"));
    if (!string.contains(QRegularExpression("^.+\\s(331|332)")))
        return false;
    channel->join(string.split(' ')[3], string.right(string.length()-i - 1));
    return true;
}

bool Parseur::in_isNameList(QString string)
{
    if (!string.contains(QRegularExpression("^.+\\s353")))
        return false;
    channel->appendChannel(string+'\n', "\"Debug\"","");
    for (auto i = 5; i < string.split(QRegularExpression("\\s:?")).length(); i++) {
         channel->addUser(string.split(QRegularExpression("\\s:?"))[i],string.split(QRegularExpression("\\s:?"))[4]);
    }
    return true;
}

bool Parseur::in_isJoinNote(QString string)
{
    if (!string.contains(IRC::RPL::JOIN))
        return false;
    channel->appendChannel(string+'\n', "\"Debug\"","");
    QString user = string.split(' ')[0];
    if(user.compare(*nickname))
        channel->addUser(user, string.split(' ')[2]);
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
    channel->appendChannel(string.right(string.length()-j-1)+'\n', string.split(' ').at(2),string.split(' ').at(0));
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

bool Parseur::in_isKickMesg(QString string)
{
    if(!string.contains(IRC::RPL::KICK))
        return false;
    QString pseudo = string.split(' ').at(2);
    if(pseudo.compare(*nickname))
        channel->leave(string.split(' ').at(1));
    return true;
}

bool Parseur::in_isPing(QString string)
{
    if(!string.contains(IRC::RPL::PING))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString pong = string.right(string.length()-j)+'\n';
    pong.prepend("PONG ");
    sendToServer(socket,pong);
    return true;
}

bool Parseur::in_isListMesg(QString string)
{
    if(!string.contains(QRegularExpression("^.+\\s(321|322|323)")))
        return false;
    if(string.contains(IRC::RPL::LIST))
    {
        listOfChannels->addRow(string);
    }
    return true;
}