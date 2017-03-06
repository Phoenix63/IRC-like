#include "parser.h"
#include "channel.h"
#include "channellist.h"

#include <QRegularExpression>
#include <QTcpSocket>
#include <QDebug>

Parser::Parser()
{

}

/*
 * Parseur: Initialisation functions
 */

void Parser::initialize(Channel *chan, QTcpSocket *sock, User nick)
{
    channel = chan;
    socket = sock;
    self = nick;
    listOfChannels = new Channellist(NULL, sock);
    modeParser = new ParserMode(chan);
}

void Parser::nickname(QString nick)
{
    self.name(nick);
}

QString Parser::nickname()
{
    return self.name();
}

/*
 * Parse::Out: Parse client request
 */

void Parser::sendToServer(QTcpSocket *socket, QString string)
{
    socket->write(string.toUtf8());
}

bool Parser::out(QString string)
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
    if (!out_isWhoisMsg(string))
    if (!out_isWhoMsg(string))
    if (!out_isMsgMsg(string))
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
    if (!in_isInitMesg(string))
    if (!in_isChanList(string))
    if (!in_isNameList(string))
    if (!in_isJoinNote(string))
    if (!in_isPartNote(string))
    if (!in_isPrivMesg(string))
    if (!in_isWhisMesg(string))
    if (!in_isNickEdit(string))
    if (!in_isListMesg(string))
    if (!in_isSetTopic(string))
    if (!in_isKickMesg(string))
    if (!in_isNoNick(string))
    if (!in_isNoChan(string))
    if (!in_isUserMode(string))
    if (!in_isChanMode(string))
    if (!in_isPing(string)) {
        channel->appendChannel(string, "\"Debug\"", nullptr);
        emit chatModifiedSignal();
    }
}

/*
 * Parseur: Out functions
 */

bool Parser::out_isCleanMsg(QString string)
{
    if(!string.startsWith("/clean"))
        return false;
        emit cleanSignal();
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
{
    if (!string.startsWith("/nick"))
        return false;
    string.replace(QString("/nick"), QString("NICK"));
    sendToServer(socket, string);
    return true;
}

bool Parser::out_isUserMsg(QString string)
{
    if (!string.startsWith("/user"))
        return false;
    string.replace(QString("/user"), QString("USER"));
    sendToServer(socket, string);
    return true;
}

bool Parser::out_isJoinMsg(QString string)
{
    if (!string.startsWith("/join"))
        return false;
    string = string.right(string.length() - 5);
    string.prepend("JOIN");
    sendToServer(socket, string);
    return true;
}

bool Parser::out_isNamesMsg(QString string)
{
    if(!string.startsWith("/names"))
        return false;
    string = string.right(string.length() - 6);
    string.prepend("NAMES");
    sendToServer(socket, string);
    channel->change("\"Debug\"");
    emit changeChannelSignal();
    return true;
}

bool Parser::out_isPassMsg(QString string)
{
    if (!string.startsWith("/pass"))
        return false;
    string=string.right(string.length() - 5);
    string.prepend("PASS");
    sendToServer(socket, string);
    return true;
}

bool Parser::out_isPartMsg(QString string)
{
    if (!string.startsWith("/part"))
        return false;
    string = string.right(string.length() - 5);
    string.prepend("PART");
    if (string.contains(QRegularExpression("^PART\\s*$")))
        string = "PART " + channel->channelName() + '\n';
    sendToServer(socket, string);
    return true;
}

bool Parser::out_isListMsg(QString string)
{
    if (!string.startsWith("/list"))
        return false;
    string.replace(QString("/list"), QString("LIST"));
    sendToServer(socket, string);
    listOfChannels->show();
    listOfChannels->initUIStyle();
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
    return true;
}

bool Parser::out_isWhoMsg(QString string)
{
    if(!string.startsWith("/who"))
        return false;
    string = string.right(string.length() - 4);
    string.prepend("WHO");
    if (channel->channelName() != "\"Debug\"")
        string = QString("WHO " + (channel->channelName()) + '\n');
    sendToServer(socket, string);
    channel->change("\"Debug\"");
    emit changeChannelSignal();
    return true;
}

bool Parser::out_isWhoisMsg(QString string)
{
    if (!string.startsWith("/whois"))
        return false;
    string = string.right(string.length() - 6);
    string.prepend("WHOIS");
    sendToServer(socket, string);
    channel->change("\"Debug\"");
    emit changeChannelSignal();
    return true;
}

bool Parser::out_isModeMsg(QString string)
{
    if (!string.startsWith("/mode"))
        return false;
    string = string.right(string.length() - 5);
    string.prepend("MODE");
    sendToServer(socket, string);
    return true;
}

bool Parser::out_isMsgMsg(QString string)
{
    if (!string.startsWith("/msg"))
        return false;
    string.replace(QString("/msg"), QString("PRIVMSG"));
    channel->joinWhisper(string.split(' ').at(1));
    channel->change(string.split(' ').at(1));
    sendToServer(socket, string);
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString message = string.right(string.length() - j - 1);
    message.remove(message.length() - 1, 1);
    channel->appendCurrent(message, &self);
    emit changeChannelSignal();
    emit chatModifiedSignal();
    emit channelModifiedSignal();
    return true;
}

bool Parser::out_isPrivMsg(QString string)
{
    QString message = string.left(string.length() - 1);
    channel->appendCurrent(message, &self);
    string.prepend("PRIVMSG " + channel->channelName() + " :");
    sendToServer(socket, string);
    emit chatModifiedSignal();
        return true;
}

bool Parser::out_isQuitMsg(QString string)
{
    if (!string.startsWith("/quit"))
            return false;
    string.replace(QString("/quit"), QString("QUIT"));
    sendToServer(socket, string);
    return true;
}

/*
 * Parseur: In private function's
 */
bool Parser::in_isInitMesg(QString string)
{
    if (!string.contains(IRC::RPL::NOTICE))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString nick = string.right(string.length() - j - 5);
    nickname(nick);
    return true;
}

bool Parser::in_isChanList(QString string)
{
    if (!string.contains(QRegularExpression("^.+\\s(331|332)\\sJOIN")))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString chan = string.split(' ').at(3);
    QString topic = string.right(string.length() - j - 1);
    channel->join(chan, topic);
    emit channelModifiedSignal();
    return true;
}

bool Parser::in_isNameList(QString string)
{
    if (!string.contains(QRegularExpression("^.+\\s353")))
        return false;
    channel->appendChannel(string, "\"Debug\"", nullptr);
    for (auto i = 5; i < string.split(QRegularExpression("\\s:?")).length(); i++) {
         channel->addUser(string.split(QRegularExpression("\\s:?"))[i],string.split(QRegularExpression("\\s:?"))[4]);
    }
    emit chatModifiedSignal();
    emit userModifiedSignal();
    return true;
}

bool Parser::in_isJoinNote(QString string)
{
    if (!string.contains(IRC::RPL::JOIN)){
        return false;
    }
    QString nick = string.split(' ').at(0);
    if(nick.startsWith('@'))
        nick.remove(0,1);
    QString chan = string.split(' ').at(2);
    if(nick.compare(self.name())) {
        channel->addUser(nick, chan);
        channel->appendChannel(nick + " joined " + chan, chan, nullptr);
    }
    emit userModifiedSignal();
    emit chatModifiedSignal();
    return true;
}

bool Parser::in_isPartNote(QString string)
{
    if (!string.contains(IRC::RPL::PART))
            return false;
    QString user = string.split(' ').at(0);
    QString chan = string.split(' ').at(2);
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString message = string.right(string.length() - j);
    if (user.compare(self.name())) {
        channel->appendChannel(user + " left " + chan + ' ' + message, chan, nullptr);
        channel->delUser(user, chan);
        channel->delUser("@" + user, chan);
    } else {
        channel->leave(chan);
        emit channelModifiedSignal();
    }
    emit changeChannelSignal();
    return true;
}

bool Parser::in_isPrivMesg(QString string)
{
    if (!string.contains(IRC::RPL::PRIVMSG))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString message = string.right(string.length() - j - 1);
    QString chan = string.split(' ').at(2);
    QString sender = string.split(' ').at(0);
    channel->appendChannel(message, chan, sender);
    if (chan != channel->channelName())
        channel->togleNotif(chan);
    emit chatModifiedSignal();
    emit channelModifiedSignal();
    return true;
}

bool Parser::in_isWhisMesg(QString string)
{
    if (!string.contains(IRC::RPL::WHISPER))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString sender = string.split(' ').at(0);
    QString message = string.right(string.length() - j - 1);
    channel->joinWhisper(sender);
    channel->appendChannel(message, sender, sender);
    if (sender != channel->channelName())
            channel->togleNotif(sender);
    emit channelModifiedSignal();
    emit chatModifiedSignal();
    return true;
}

bool Parser::in_isNickEdit(QString string)
{
    if (!string.contains(IRC::RPL::NICK))
        return false;
    QString nick = string.split(' ').at(0);
    QString newNick = string.split(' ').at(2);
    if (!nick.compare(self.name()))
        nickname(newNick);
    channel->changeNick(nick, newNick);
    channel->appendChannel(nick + " changed his nickname to " + newNick, "\"Debug\"", "");
    emit userModifiedSignal();
    emit chatModifiedSignal();
    return true;
}

bool Parser::in_isKickMesg(QString string)
{
    if(!string.contains(IRC::RPL::KICK))
        return false;
    QString admin = string.split(' ').at(0);
    QString chan = string.split(' ').at(2);
    QString kicked = string.split(' ').at(3);
    if(!kicked.compare(self.name())){
        channel->appendChannel("You were kicked from " + chan + " by " + admin, "\"Debug\"", "");
        channel->leave(chan);
    }
    else{
        channel->appendChannel(kicked + " was kicked from " + chan + " by " + admin, "\"Debug\"", "");
    }
    emit chatModifiedSignal();
    emit channelModifiedSignal();
    return true;
}

bool Parser::in_isPing(QString string)
{
    if(!string.contains(IRC::RPL::PING))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString pong = string.right(string.length() - j) + '\n';
    pong.prepend("PONG ");
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
    return true;
}

bool Parser::in_isSetTopic(QString string)
{
    if (!string.contains(QRegularExpression("^.+\\s(331|332)\\sTOPIC")))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString topic = string.right(string.length() - j - 1);
    QString chan = string.split(' ').at(3);
    channel->topic(topic, chan);
    emit topicModifiedSignal();
    return true;
}

bool Parser::in_isNoNick(QString string)
{
    if (!string.contains(IRC::ERR::NOSUCHNICK))
        return false;
    QString nick = string.split(' ').at(2);
    channel->leave(nick);
    channel->change("\"Debug\"");
    channel->appendChannel("No such nick", "\"Debug\"", "");
    emit channelModifiedSignal();
    emit changeChannelSignal();
    return true;
}

bool Parser::in_isNoChan(QString string)
{
    if (!string.contains(IRC::ERR::NOSUCHNICK))
        return false;
    QString chan = string.split(' ').at(2);
    channel->leave(chan);
    channel->change("\"Debug\"");
    channel->appendChannel("No such channel", "\"Debug\"", "");
    emit channelModifiedSignal();
    emit changeChannelSignal();
    return true;
}

bool Parser::in_isChanMode(QString string)
{
    if (!string.contains(IRC::RPL::MODECHAN))
        return false;
    modeParser->parseChan(string);
    emit channelModifiedSignal();
    return true;
}

bool Parser::in_isUserMode(QString string)
{
    if (!string.contains(IRC::RPL::MODEUSER))
        return false;
    modeParser->parseUser(string);
    emit changeChannelSignal();
    emit userModifiedSignal();
    emit channelModifiedSignal();
    return true;
}
