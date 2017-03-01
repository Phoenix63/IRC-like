#include "parser.h"
#include "channel.h"
#include "channellist.h"

#include <QRegularExpression>
#include <QTcpSocket>

/*
 * Parseur: Initialisation functions
 */
<<<<<<< HEAD:ChatIRC/parser.cpp
void Parser::initialize(Channel *chan, QTcpSocket *sock, QString *nick, Channellist *list)
{
    channel = chan;
    socket = sock;
    nickname = nick;
    listOfChannels = list;
}

void Parser::setNickname(QString *nick)
=======

void Parseur::setChannel(Channel *chan)
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
{
    channel = chan;
}

/*
 * Parse::Out: Parse client request
 */

<<<<<<< HEAD:ChatIRC/parser.cpp
void Parser::sendToServer(QTcpSocket *socket, QString string)
{
    socket->write(string.toUtf8());
=======
void Parseur::setSocket(QTcpSocket *sock){
    socket = sock;
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
}

bool Parser::out(QString string)
{
    string.append('\n');
    channel->appendCurrent(string);
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
    if (!out_isDebugMsg(string))
    if (!out_isPrivMsg(string))
        return false;
    return true;
}

/*
 * Parseur::in: Parse server response
 */

void Parser::in(QString string)
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
        channel->appendChannel(string+'\n', "\"Debug\"", "");
}

/*
 * Parseur: Out functions
 */

<<<<<<< HEAD:ChatIRC/parser.cpp
bool Parser::out_isCleanMsg(QString string)
{
    if(!string.startsWith("/clean"))
        return false;
    channel->clearContent();
    channel->refreshText();
    return true;
}

bool Parser::out_isDebugMsg(QString string)
{
    if(!string.startsWith("/debug"))
        return false;
    sendToServer(socket,string.right(string.length() - 7));
    return true;
}

bool Parser::out_isNickMsg(QString string)
=======
bool Parseur::out_isNickMsg(QString string)
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
{
    if (!string.startsWith("/nick"))
        return false;
    string.replace(QString("/nick"), QString("NICK"));
<<<<<<< HEAD:ChatIRC/parser.cpp
    sendToServer(socket, string);
=======
    socket->write(string.toLatin1().data());
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

bool Parser::out_isUserMsg(QString string)
{
    if (!string.startsWith("/user"))
        return false;
    string.replace(QString("/user"), QString("USER"));
<<<<<<< HEAD:ChatIRC/parser.cpp
    sendToServer(socket, string);
=======
    socket->write(string.toLatin1().data());
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

bool Parser::out_isJoinMsg(QString string)
{
    if (!string.startsWith("/join"))
        return false;
<<<<<<< HEAD:ChatIRC/parser.cpp
    string = string.right(string.length() - 5);
    string.prepend("JOIN");
    sendToServer(socket, string);
=======
    string=string.right(string.length()-5);
    string.prepend("JOIN");
    socket->write(string.toLatin1().data());
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

bool Parser::out_isNamesMsg(QString string)
{
    if(!string.startsWith("/names"))
        return false;
<<<<<<< HEAD:ChatIRC/parser.cpp
    string = string.right(string.length() - 6);
    string.prepend("NAMES");
    sendToServer(socket, string);
    channel->change("\"Debug\"");
=======
    string=string.right(string.length()-6);
    string.prepend("NAMES");
    socket->write(string.toLatin1().data());
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

bool Parser::out_isPassMsg(QString string)
{
    if (!string.startsWith("/pass"))
        return false;
    string=string.right(string.length() - 5);
    string.prepend("PASS");
<<<<<<< HEAD:ChatIRC/parser.cpp
    sendToServer(socket, string);
=======
    socket->write(string.toLatin1().data());
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

bool Parser::out_isPartMsg(QString string)
{
    if (!string.startsWith("/part"))
        return false;
<<<<<<< HEAD:ChatIRC/parser.cpp
    string = string.right(string.length() - 5);
=======
    string=string.right(string.length()-5);
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    string.prepend("PART");
    if (string.contains(QRegularExpression("^PART\\s*$"))) {
        string="PART "+channel->channelName()+ '\n';
        channel->leave(channel->channelName());
    } else {
        channel->leave(string.split(' ').at(1).left(string.split(' ').at(1).length()-1));
    }
<<<<<<< HEAD:ChatIRC/parser.cpp
    sendToServer(socket, string);
=======
    socket->write(string.toLatin1().data());
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

bool Parser::out_isListMsg(QString string)
{
    if (!string.startsWith("/list"))
        return false;
    string.replace(QString("/list"), QString("LIST"));
<<<<<<< HEAD:ChatIRC/parser.cpp
    sendToServer(socket, string);
    listOfChannels->show();
    listOfChannels->clear();
    return true;
}

bool Parser::out_isTopicMsg(QString string)
{
    if(!string.startsWith("/topic"))
        return false;
    string = string.right(string.length() - 6);
    string.prepend("TOPIC");
    if (string.contains(QRegularExpression("^TOPIC\\s*$")))
        string="TOPIC " + channel->channelName() + '\n';
    sendToServer(socket, string);
    return true;
}

bool Parser::out_isKickMsg(QString string)
{
    if (!string.startsWith("/kick"))
        return false;
    string = string.right(string.length() - 5);
    string.prepend("KICK");
    sendToServer(socket, string);
=======
    socket->write(string.toLatin1().data());
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

bool Parser::out_isWhoMsg(QString string)
{
    if(!string.startsWith("/who "))
        return false;
<<<<<<< HEAD:ChatIRC/parser.cpp
    string = string.right(string.length() - 4);
    string.prepend("WHO");
    if (channel->channelName() != "\"Debug\"")
        string = QString("WHO " + (channel->channelName()) + '\n');
    sendToServer(socket, string);
    channel->change("\"Debug\"");
=======
    string=string.right(string.length()-4);
    string.prepend("WHO");
    if (channel->channelName() != "\"Debug\"")
        string = QString("WHO "+ (channel->channelName()) +'\n');
    socket->write(string.toLatin1().data());
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

bool Parser::out_isWhoisMsg(QString string)
{
    if (!string.startsWith("/whois"))
        return false;
<<<<<<< HEAD:ChatIRC/parser.cpp
    string = string.right(string.length() - 6);
    string.prepend("WHOIS");
    sendToServer(socket, string);
    channel->change("\"Debug\"");
    return true;
}

bool Parser::out_isModeMsg(QString string)
=======
    string=string.right(string.length()-5);
    string.prepend("WHOIS");
    socket->write(string.toLatin1().data());
    return true;
}

bool Parseur::out_isMsgMsg(QString string)
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
{
    if (!string.startsWith("/msg"))
        return false;
<<<<<<< HEAD:ChatIRC/parser.cpp
    string = string.right(string.length() - 5);
    string.prepend("MODE");
    sendToServer(socket, string);
    return true;
}

bool Parser::out_isMsgMsg(QString string)
=======
    string.replace(QString("/msg"), QString("PRIVMSG"));
    channel->joinWhisper(string.split(' ').at(1));
    socket->write(string.toLatin1().data());
    return true;
}

bool Parseur::out_isDebugMsg(QString string)
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
{
    if (channel->channelName() == "\"Debug\"")
        return false;
<<<<<<< HEAD:ChatIRC/parser.cpp
    string.replace(QString("/msg"), QString("PRIVMSG"));
    channel->joinWhisper(string.split(' ').at(1));
    channel->change(string.split(' ').at(1));
    sendToServer(socket, string);
    int j = string.indexOf(QRegularExpression(":.+$"));
    channel->appendCurrent(string.right(string.length() - j - 1) + '\n');
=======
    string.prepend("PRIVMSG " + channel->channelName() + " :");
    socket->write(string.toLatin1().data());
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

bool Parser::out_isPrivMsg(QString string)
{
<<<<<<< HEAD:ChatIRC/parser.cpp
    channel->appendCurrent(string);
    string.prepend("PRIVMSG " + channel->channelName() + " :");
    sendToServer(socket, string);
=======
    string.prepend("PRIVMSG ");
    socket->write(string.toLatin1().data());
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
        return true;
}

bool Parser::out_isQuitMsg(QString string)
{
    if (!string.startsWith("/quit"))
            return false;
    string.replace(QString("/quit"), QString("QUIT"));
<<<<<<< HEAD:ChatIRC/parser.cpp
    sendToServer(socket, string);
=======
    socket->write(string.toLatin1().data());
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

/*
 * Parseur: In private function's
 */

bool Parser::in_isChanList(QString string)
{
    int i = string.indexOf(QRegularExpression(":.+$"));
    if (string.contains(QRegularExpression("^.+\\s(331|332)")))
        channel->join(string.split(' ')[3], string.right(string.length()-i - 1));
    else
        return false;
<<<<<<< HEAD:ChatIRC/parser.cpp
    channel->join(string.split(' ')[3], string.right(string.length() - i - 1));
    return true;
}

bool Parser::in_isNameList(QString string)
=======
    return true;
}


bool Parseur::in_isNameList(QString string)
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
{
    if (string.contains(QRegularExpression("^.+\\s353"))) {
        channel->appendChannel(string+'\n', "\"Debug\"","");
        for (auto i = 5; i < string.split(QRegularExpression("\\s:?")).length(); i++) {
            channel->addUser(string.split(QRegularExpression("\\s:?"))[i],string.split(QRegularExpression("\\s:?"))[4]);
        }
    } else {
        return false;
<<<<<<< HEAD:ChatIRC/parser.cpp
    channel->appendChannel(string + '\n', "\"Debug\"", "");
    for (auto i = 5; i < string.split(QRegularExpression("\\s:?")).length(); i++) {
         channel->addUser(string.split(QRegularExpression("\\s:?"))[i],string.split(QRegularExpression("\\s:?"))[4]);
=======
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    }
    return true;

}

bool Parser::in_isJoinNote(QString string)
{
    if (!string.contains(IRC::RPL::JOIN))
        return false;
<<<<<<< HEAD:ChatIRC/parser.cpp
    channel->appendChannel(string + '\n', "\"Debug\"", "");
    QString user = string.split(' ')[0];
    if(user.compare(*nickname))
        channel->addUser(user, string.split(' ')[2]);
=======
    channel->appendChannel(string+'\n', "\"Debug\"","");
    channel->addUser(string.split(' ')[0], string.split(' ')[2]);
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

bool Parser::in_isPartNote(QString string)
{
    if (!string.contains(IRC::RPL::PART))
            return false;
    channel->appendChannel(string + '\n', "\"Debug\"", "");
    channel->delUser(string.split(' ')[0], string.split(' ')[2]);
    return true;
}

bool Parser::in_isPrivMesg(QString string)
{
    if (!string.contains(IRC::RPL::PRIVMSG))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
<<<<<<< HEAD:ChatIRC/parser.cpp
    channel->appendChannel(string.right(string.length() - j - 1)+'\n', string.split(' ').at(2),string.split(' ').at(0));
=======
    QString sender = string.split(' ').at(0);
    qDebug() << "message from :" << sender;
    channel->joinWhisper(sender);
    channel->appendChannel(string.right(string.length()-j)+'\n', string.split(' ').at(2),sender);
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

bool Parser::in_isWhisMesg(QString string)
{
    if (!string.contains(IRC::RPL::WHISPER))
        return false;
    qDebug() << "test";
    int j = string.indexOf(QRegularExpression(":.+$"));
<<<<<<< HEAD:ChatIRC/parser.cpp
    QString sender = string.split(' ').at(0);
    channel->joinWhisper(sender);
    channel->appendChannel(string.right(string.length()- j) + '\n', string.split(' ').at(0), sender);
=======
    channel->appendChannel(string.right(string.length()-j)+'\n', string.split(' ').at(0),string.split(' ').at(0));
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}

bool Parser::in_isNickEdit(QString string)
{
    if (!string.contains(IRC::RPL::NICK))
        return false;
    qDebug() << "nick";
    channel->changeNick(string.split(' ')[0], string.split(' ')[2]);
    channel->appendChannel(string + '\n', "\"Debug\"", "");
    return true;
}

<<<<<<< HEAD:ChatIRC/parser.cpp
bool Parser::in_isKickMesg(QString string)
{
    if(!string.contains(IRC::RPL::KICK))
        return false;
    QString pseudo = string.split(' ').at(2);
    if(pseudo.compare(*nickname))
        channel->leave(string.split(' ').at(1));
    return true;
}

bool Parser::in_isPing(QString string)
=======
bool Parseur::in_isPing(QString string)
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
{
    if(!string.contains(IRC::RPL::PING))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString pong = string.right(string.length() - j) + '\n';
    pong.prepend("PONG ");
<<<<<<< HEAD:ChatIRC/parser.cpp
    sendToServer(socket, pong);
    return true;
}

bool Parser::in_isListMesg(QString string)
{
    if(!string.contains(QRegularExpression("^.+\\s(321|322|323)")))
        return false;
    if(string.contains(IRC::RPL::LIST))
    {
        listOfChannels->addRow(string);
    }
=======
    socket->write(pong.toLatin1().data());
>>>>>>> origin/ClientLourd:ChatIRC/parseur.cpp
    return true;
}
