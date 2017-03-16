#include "parser.h"

#include <QMessageBox>
#include <QRegularExpression>
#include <QString>
#include <QTcpSocket>

#include "../channel/channel.h"
#include "../gui/channellist.h"

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

User * Parser::userNick()
{
    return &self;
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
    if (!out_isListFileMsg(string))
    if (!out_isRmFileMsg(string))
    if (!out_isCleanMsg(string))
    if (!out_isDebugMsg(string))
    if (!out_isModeMsg(string))
    if (!out_isTopicMsg(string))
    if (!out_isKickMsg(string))
    if (!out_isServKickMsg(string))
    if (!out_isWhoisMsg(string))
    if (!out_isWhoMsg(string))
    if (!out_isMsgMsg(string))
	if (!out_isAwayMsg(string))
    if (!out_isInvMsg(string))
    if (!out_isBeloteMsg(string))
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
    if (!in_isInitMsg(string))
    if (!in_isChanList(string))
    if (!in_isNameList(string))
    if (!in_isJoinNote(string))
    if (!in_isPartNote(string))
	if (!in_isQuitNote(string))
    if (!in_isPrivMsg(string))
    if (!in_isWhisMsg(string))
    if (!in_isNickEdit(string))
    if (!in_isListMsg(string))
    if (!in_isListFileMsg(string))
    if (!in_isRmFileMsg(string))
    if (!in_isSetTopic(string))
    if (!in_isKickMsg(string))
    if (!in_isEndKickMsg(string))
    if (!in_isNoNick(string))
    if (!in_isNoChan(string))
    if (!in_isUserMode(string))
    if (!in_isChanMode(string))
	if (!in_isAwayStatus(string))
	if (!in_isAwayPrivMsg(string))
    if (!in_isInvMsg(string))
    if (!in_isInvBelMsg(string))
    if (!in_isBeloteMsg(string))
    if (!in_isConfirmInv(string))
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

bool Parser::out_isListFileMsg(QString string)
{
    if(!string.startsWith("/files"))
        return false;
    string = string.right(string.length() - 6);
    string.prepend("LISTFILES");
    if (string.contains(QRegularExpression("^LISTFILES\\s*$")))
        string = "LISTFILES " + channel->channelName() + '\n';
    sendToServer(socket, string);
    return true;
}

bool Parser::out_isRmFileMsg(QString string)
{
    if(!string.startsWith("/rmfile"))
        return false;
    QString chan = string.split(' ').at(1);
    QString url = string.split(' ').last();
    string = string.right(string.length() - 7);
    string.prepend("RMFILE");
    if (chan == url)
        string = "RMFILE " + channel->channelName() + ' ' + url + '\n';
    sendToServer(socket, string);
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
    string.remove(string.length() - 1, 1);
    if (!string.startsWith("/kick"))
        return false;
    QString user = string.split(' ').at(1);
    QString command;
    if (!user.startsWith('#'))
        command = "MODE " + channel->channelName() + " +b " + user + " 0\n";
    else {
        //second arg is a channel, user is the third arg
        QString nick = string.split(' ').at(2);
        command = "MODE " + user + " +b " + nick + " 0\n";
    }
    sendToServer(socket, command);
    return true;
}

bool Parser::out_isServKickMsg(QString string)
{
    if (!string.startsWith("/serverkick"))
        return false;
    string = string.right(string.length() - 11);
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
    emit channelModifiedSignal();
    return true;
}

bool Parser::out_isInvMsg(QString string)
{
    if(!string.startsWith("/invite"))
        return false;
    string = string.right(string.length() - 7);
    string.prepend("INVITE");
    sendToServer(socket, string);
    return true;
}

bool Parser::out_isPrivMsg(QString string)
{
    QString message = string.left(string.length() - 1);
    channel->appendCurrent(message, &self);
    string.prepend("PRIVMSG " + channel->channelName() + " :");
    sendToServer(socket, string);
    emit lineAddedSignal();
        return true;
}

bool Parser::out_isAwayMsg(QString string)
{
    if (!(string.startsWith("/away") || string.startsWith("/back")))
        return false;
    string = string.right(string.length() - 5);
    string.prepend("AWAY");
    sendToServer(socket, string);
    channel->change("\"Debug\"");
    emit changeChannelSignal();
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

bool Parser::out_isBeloteMsg(QString string)
{
	if (!string.startsWith("/belote"))
		return false;
	string.replace(QString("/belote"), QString("BELOTE JOIN"));
    sendToServer(socket, string);
    return true;
}
/*
 * Parseur: In private function's
 */
bool Parser::in_isInitMsg(QString string)
{
    if (!string.contains(IRC::RPL::NOTICE))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString nick = string.right(string.length() - j - 5);
    self.name(nick);
    channel->addUser(&self);
    return true;
}

bool Parser::in_isChanList(QString string)
{
    if (!string.contains(IRC::RPL::CHAN))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString chan = string.split(' ').at(3);
    QString topic = string.right(string.length() - j - 1);
    if (chan.startsWith('&')) {
        channel->joinBelote(chan, socket);
    } else {
        channel->join(chan, topic);
        emit channelModifiedSignal();
    }
    return true;
}

bool Parser::in_isNameList(QString string)
{
    if (!string.contains(IRC::RPL::NAMEREPLY))
        return false;
    channel->change("\"Debug\"");
    channel->appendChannel(string, "\"Debug\"", nullptr);
    QString tmp = string.split(':').last();
    QString chan = string.split(' ').at(4);
    QStringList users = tmp.split(' ');
    for (auto i:users){
        channel->addUser(i,chan);
    }
    emit changeChannelSignal();
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
    QString tmp = nick;
    if(nick.startsWith('@'))
        nick.remove(0,1);
    QString chan = string.split(' ').at(2);
    if(nick.compare(self.name())) {
        channel->addUser(tmp, chan);
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
        channel->removeUser(user, chan);
    } else {
        channel->leave(chan);
        emit channelModifiedSignal();
    }
    emit changeChannelSignal();
    return true;
}

bool Parser::in_isQuitNote(QString string)
{
	if (!string.contains(IRC::RPL::QUIT))
		return false;
    QString user = string.split(' ').at(0);
    for (auto i:channel->channelNames()) {
        if (i == user) {
			channel->appendChannel(user + " disconnected from server.", i, nullptr);
            emit lineAddedSignal();
        }
    }
    channel->deleteUser(user);
    return true;
}

bool Parser::in_isPrivMsg(QString string)
{
    if (!string.contains(IRC::RPL::PRIVMSG))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString message = string.right(string.length() - j - 1);
    QString chan = string.split(' ').at(2);
    QString sender = string.split(' ').at(0);
    channel->appendChannel(message, chan, sender);
    if (chan != channel->channelName())
        channel->togleNotif(chan, true);
    emit chatModifiedSignal();
    emit channelModifiedSignal();
    return true;
}

bool Parser::in_isWhisMsg(QString string)
{
    if (!string.contains(IRC::RPL::WHISPER))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString sender = string.split(' ').at(0);
    QString message = string.right(string.length() - j - 1);
    channel->joinWhisper(sender);
    channel->addUser(sender, sender);
    channel->appendChannel(message, sender, sender);
    if (sender != channel->channelName())
            channel->togleNotif(sender, true);
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
    for (auto i:channel->channelNames()) {
        if (channel->contains(nick, i))
    		channel->appendChannel(nick + " changed his nickname to " + newNick, i, "");
        if (i == nick) {
            channel->changeName(nick, newNick);
            emit channelModifiedSignal();
        }
    }
    if (!nick.compare(self.name()))
        nickname(newNick);
	channel->changeNick(nick, newNick);
	emit userModifiedSignal();
    emit chatModifiedSignal();
    return true;
}

bool Parser::in_isKickMsg(QString string)
{
    if (!string.contains(IRC::RPL::KICK))
        return false;
    QString admin = string.split(' ').at(0);
    QString chan = string.split(' ').at(2);
    QString kicked = string.split(' ').at(3);
    if(!kicked.compare(self.name())) {
        channel->appendChannel("You were kicked from " + chan + " by " + admin, "\"Debug\"", nullptr);
        channel->leave(chan);
    } else {
    	channel->appendChannel(kicked + " was kicked by " + admin, chan, "");
	}
    emit channelModifiedSignal();
    emit changeChannelSignal();
    return true;
}

bool Parser::in_isEndKickMsg(QString string)
{
    if (!string.contains(IRC::RPL::ENDOFKICK))
        return false;
    QString chan = string.split(' ').at(2);
    channel->appendChannel("Your mode in " + chan + " has been updated", "\"Debug\"", "");
    emit channelModifiedSignal();
    return true;
}

bool Parser::in_isPing(QString string)
{
    if (!string.contains(IRC::RPL::PING))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString pong = string.right(string.length() - j) + '\n';
    pong.prepend("PONG ");
    sendToServer(socket, pong);
    return true;
}

bool Parser::in_isListMsg(QString string)
{
    if(!string.contains(IRC::RPL::LIST))
        return false;
    if(string.contains(IRC::RPL::LIST))
    {
        listOfChannels->addRow(string);
    }
    return true;
}

bool Parser::in_isListFileMsg(QString string)
{
    if (!string.contains(IRC::RPL::FILELIST))
        return false;
    QString chan = string.split(' ').at(2);
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString url = string.right(string.length() - j - 1);
    channel->appendChannel(url, chan, "");
    emit chatModifiedSignal();
    return true;
}

bool Parser::in_isRmFileMsg(QString string)
{
    if (!string.contains(IRC::RPL::RMFILE))
        return false;
    QString user = string.split(' ').at(0);
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString url = string.right(string.length() - j - 1);
    channel->appendChannel(user + " removed file " + url + "from " + channel->channelName(), channel->channelName(), "");
    emit chatModifiedSignal();
    return true;
}

bool Parser::in_isSetTopic(QString string)
{
    if (!string.contains(IRC::RPL::TOPIC))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString topic = string.right(string.length() - j - 1);
    QString chan = string.split(' ').at(3);
    channel->topic(topic, chan);
    emit topicModifiedSignal();
    return true;
}

bool Parser::in_isInvMsg(QString string)
{
    if (!string.contains(QRegularExpression(IRC::RPL::INVITED)))
        return false;
    QString chan = string.split(' ').at(3);
	QString tmp = "Do you want to join : " + chan + '?';
    if (QMessageBox::Yes == QMessageBox(QMessageBox::Information, "Invitation", "Do you want to join : " + chan + '?', QMessageBox::Yes|QMessageBox::No).exec())
    {
        sendToServer(socket, "JOIN " + chan + '\n');
    }
    return true;
}

bool Parser::in_isInvBelMsg(QString string)
{
    if (!string.contains(QRegularExpression(IRC::RPL::INVBELOTE)))
        return false;
    QString chan = string.split(' ').at(3);
	QString tmp = "Do you want to play belote in : " + chan + '?';
    if (QMessageBox::Yes == QMessageBox(QMessageBox::Information, "Invitation", "Do you want to join : " + chan + '?', QMessageBox::Yes|QMessageBox::No).exec())
    {
        sendToServer(socket, "BELOTE JOIN " + chan + '\n');
    }
    return true;
}

bool Parser::in_isBeloteMsg(QString string)
{
    QString chan = string.split(' ').at(2);
    if (!string.contains(QRegularExpression(IRC::RPL::BELOTE)))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString message = string.right(string.length() - j - 1);
    channel->beloteParse(chan, message);
    return true;
}

bool Parser::in_isConfirmInv(QString string)
{
    if (!string.contains(QRegularExpression(IRC::RPL::INVITING)))
        return false;
    QString chan = string.split(' ').at(3);
    QString user = string.split(' ').at(2);
    channel->appendChannel("You invited " + user + " to " + chan, chan, "");
    emit chatModifiedSignal();
    return true;
}

bool Parser::in_isAwayStatus(QString string)
{
    if(! (string.contains(IRC::RPL::SETAWAY) || string.contains(IRC::RPL::SETBACK) ))
        return false;
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString message = string.right(string.length() - j - 1);
    channel->appendChannel(message, "\"Debug\"", "");
    if (string.contains(IRC::RPL::SETAWAY))
        channel->appendChannel("/back to unset", "\"Debug\"", "");
    emit chatModifiedSignal();
    return true;
}

bool Parser::in_isAwayPrivMsg(QString string)
{
    if (!string.contains(IRC::RPL::ISAWAY))
        return false;
    QString nick = string.split(' ').at(2);
    int j = string.indexOf(QRegularExpression(":.+$"));
    QString message = string.right(string.length() - j - 1);
    channel->appendChannel(nick + " is away : " + message, nick, "");
    emit changeChannelSignal();
    emit channelModifiedSignal();

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
    emit channelModifiedSignal();
    return true;
}
