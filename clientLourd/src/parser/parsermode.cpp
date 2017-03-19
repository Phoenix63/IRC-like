#include "parsermode.h"

#include <QString>

#include "../channel/channel.h"

ParserMode::ParserMode(Channel *chan) :
    channel(chan)
{
}

void ParserMode::parseUser(QString string)
{
    QString user = string.split(' ').at(3);
    QString mode = string.split(' ').at(4);
    if (!isIUserMode(mode, user))
    if (!isOUserMode(mode, user))
    if (!isWMode(mode, user))
        return;
}

void ParserMode::parseChan(QString string)
{
    QString chan = string.split(' ').at(3);
	QString mode = string.split(' ').at(4);
    QString arg = string.split(' ').last();
    if(!isIChanMode(mode, chan))
    if(!isOChanMode(mode, chan, arg))
    if(!isPMode(mode, chan))
    if(!isSMode(mode, chan))
    if(!isTMode(mode, chan))
    if(!isNMode(mode, chan))
    if(!isMMode(mode, chan))
    if(!isLMode(mode, chan, arg))
    if(!isBMode(mode, chan, arg))
    if(!isVMode(mode, chan, arg))
    if(!isKMode(mode, chan, arg))
        return;
}

bool ParserMode::isIUserMode(QString mode, QString user)
{
    if (mode[1] != 'i')
        return false;
    if (mode[0] == '+') {
        channel->modeI(true, user);
    } else {
        channel->modeI(false, user);
    }
    return true;
}

bool ParserMode::isOUserMode(QString mode, QString user)
{
    if (mode[1] != 'o')
        return false;
    if (mode[0] == '+') {
        channel->modeO(true, user);
        channel->appendChannel(user + " is now IRC operator", "\"Debug\"", nullptr);
    } else {
        channel->modeO(false, user);
        channel->appendChannel(user + " is no longer IRC operator", "\"Debug\"", nullptr);
    }
    return true;
}

bool ParserMode::isWMode(QString mode, QString user)
{
    if (mode[1] != 'w')
        return false;
    if (mode[0] == '+') {
        channel->modeW(true, user);
    } else {
        channel->modeW(false, user);
    }
    return true;
}

bool ParserMode::isIChanMode(QString mode, QString chan){
    if (!mode.contains('i'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("This Channel is now accessible on invite only.", chan, nullptr);
    else
        channel->appendChannel("This Channel is now open to everyone.", chan, nullptr);
    return true;
}

bool ParserMode::isOChanMode(QString mode, QString chan, QString user)
{
    if(!mode.contains('o'))
        return false;
    if (mode[0] == '+') {
        channel->appendChannel(user + " is now channel operator.", chan, nullptr);
        channel->oper(user, chan, true);
    } else {
        channel->appendChannel(user + " is no longer channel operator.", chan, nullptr);
        channel->oper(user, chan, false);
    }
    return true;
}

bool ParserMode::isPMode(QString mode, QString chan)
{
    if(!mode.contains('p'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("This Channel is now private.", chan, nullptr);
    else
        channel->appendChannel("This Channel is now public.", chan, nullptr);
    return true;
}

bool ParserMode::isSMode(QString mode, QString chan)
{
    if(!mode.contains('s'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("This Channel is now secret.", chan, nullptr);
    else
        channel->appendChannel("This Channel isn't secret anymore.", chan, nullptr);
    return true;
}

bool ParserMode::isTMode(QString mode, QString chan)
{
    if(!mode.contains('t')){
        return false;
    }
    if (mode[0] == '+') {
        channel->appendChannel("The topic of this channel can be modified by operators only.", chan, nullptr);
    }
    else
        channel->appendChannel("Everyone can now change the topic of this channel.", chan, nullptr);
    return true;
}

bool ParserMode::isNMode(QString mode, QString chan)
{
    if(!mode.contains('n'))
        return false;
    if (mode[0] == '+'){
        channel->appendChannel("This channel doesn't accepts messages from outside.", chan, nullptr);
    }
    else
        channel->appendChannel("This channel accepts messages from outside.", chan, nullptr);
    return true;
}

bool ParserMode::isMMode(QString mode, QString chan)
{
    if(!mode.contains('m'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("This channel is now moderated.", chan, nullptr);
    else
        channel->appendChannel("This channel isn't moderated anymore.", chan, nullptr);
    return true;
}

bool ParserMode::isLMode(QString mode, QString chan, QString arg)
{
    int maxUsers = arg.toInt();
    if(!mode.contains('n'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("Limit of users in this channel set to : " + maxUsers, chan, nullptr);
    else
        channel->appendChannel("This channel isn't limited on users anymore.", chan, nullptr);
    return true;
}

bool ParserMode::isBMode(QString mode, QString chan, QString user)
{
    if(!mode.contains('m'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel(user + " is now banned from this channel.", chan, nullptr);
    else
        channel->appendChannel(user + " is no longer banned from this channel.", chan, nullptr);
    return true;
}

bool ParserMode::isVMode(QString mode, QString chan, QString user)
{
    if(!mode.contains('v'))
        return false;
    if (mode[0] == '+') {
        channel->appendChannel(user + " can now talk in this moderated channel.", chan, nullptr);
        channel->voice(user, chan, true);
    } else {
        channel->appendChannel(user + " can no longer talk in this moderated channel", chan, nullptr);
        channel->voice(user, chan, false);
    }
    return true;
}

bool ParserMode::isKMode(QString mode, QString chan, QString password)
{
    if(!mode.contains('k'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("The password of this channel is now set to : " + password, chan, nullptr);
    else
        channel->appendChannel("This channel no longer have a password.", chan, nullptr);
    return true;
}
