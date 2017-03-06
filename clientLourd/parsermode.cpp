#include "parsermode.h"

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
    if(!isIChanMode(mode))
    if(!isOChanMode(mode, string))
    if(!isPMode(mode))
    if(!isSMode(mode))
    if(!isTMode(mode))
    if(!isNMode(mode))
    if(!isMMode(mode))
    if(!isLMode(mode, string))
    if(!isBMode(mode, string))
    if(!isVMode(mode, string))
    if(!isKMode(mode, string))
        return;
}

bool ParserMode::isIUserMode(QString mode, QString user)
{
    if (mode[1] != 'i')
        return false;
    if (mode[0] == '+') {
        userList.modeI(true, user);
    } else {
        userList.modeI(false, user);
    }
    return true;
}

bool ParserMode::isOUserMode(QString mode, QString user)
{
    if (mode[1] != 'o')
        return false;
    if (mode[0] == '+') {
        userList.modeO(true, user);
    } else {
        userList.modeO(false, user);
    }
    return true;
}

bool ParserMode::isWMode(QString mode, QString user)
{
    if (mode[1] != 'w')
        return false;
    if (mode[0] == '+') {
        userList.modeW(true, user);
    } else {
        userList.modeW(false, user);
    }
    return true;
}

bool ParserMode::isIChanMode(QString mode){
    if (!mode.contains('i'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("Channel accessible sur invitation seulement", channel->channelName(), "");
    else
        channel->appendChannel("Channel accessible sans invitation", channel->channelName(), "");
    return true;
}

bool ParserMode::isOChanMode(QString mode, QString string)
{
    QString user = string.split(' ').last();
    if(!mode.contains('o'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel(user + " est maintenant operateur de ce channel", channel->channelName(), "");
    else
        channel->appendChannel(user + " n'est plus opérateur de ce channel", channel->channelName(), "");
    return true;
}

bool ParserMode::isPMode(QString mode)
{
    if(!mode.contains('p'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("Ce channel est maintenant privé", channel->channelName(), "");
    else
        channel->appendChannel("Ce channel n'est plus privé", channel->channelName(), "");
    return true;
}

bool ParserMode::isSMode(QString mode)
{
    if(!mode.contains('s'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("Ce channel est maintenant secret", channel->channelName(), "");
    else
        channel->appendChannel("Ce channel n'est plus secret", channel->channelName(), "");
    return true;
}

bool ParserMode::isTMode(QString mode)
{
    if(!mode.contains('t'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("Le sujet de ce channel n'est modifiable que par les opérateurs", channel->channelName(), "");
    else
        channel->appendChannel("Tout le monde peut modifier le sujet du channel", channel->channelName(), "");
    return true;
}

bool ParserMode::isNMode(QString mode)
{
    if(!mode.contains('n'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("Ce channel n'accepte pas les messages extérieurs", channel->channelName(), "");
    else
        channel->appendChannel("Ce channel accepte les messages extérieurs", channel->channelName(), "");
    return true;
}

bool ParserMode::isMMode(QString mode)
{
    if(!mode.contains('m'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("Ce channel est modéré", channel->channelName(), "");
    else
        channel->appendChannel("Ce channel n'est plus modéré", channel->channelName(), "");
    return true;
}

bool ParserMode::isLMode(QString mode, QString string)
{
    int maxUsers = string.split(' ').last().toInt();
    if(!mode.contains('n'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("Nombre d'utilisateurs maximum dans ce channel : " + maxUsers, channel->channelName(), "");
    else
        channel->appendChannel("Ce channel n'est pas limité en nombre d'utilisateurs", channel->channelName(), "");
    return true;
}

bool ParserMode::isBMode(QString mode, QString string)
{
    QString user = string.split(' ').at(3);
    if(!mode.contains('m'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel(user + " est banni de ce channel", channel->channelName(), "");
    else
        channel->appendChannel(user + " n'est plus banni de ce channel", channel->channelName(), "");
    return true;
}

bool ParserMode::isVMode(QString mode, QString string)
{
    QString user = string.split(' ').last();
    if(!mode.contains('v'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel(user + " peux désormais parler dans ce channel", channel->channelName(), "");
    else
        channel->appendChannel(user + " ne peux plus parler dans ce channel", channel->channelName(), "");
    return true;
}

bool ParserMode::isKMode(QString mode, QString string)
{
    QString password = string.split(' ').last();
    if(!mode.contains('k'))
        return false;
    if (mode[0] == '+')
        channel->appendChannel("Le mot de passe de ce channel est désormais : " + password, channel->channelName(), "");
    else
        channel->appendChannel("Ce channel n'a plus de mot de passe", channel->channelName(), "");
    return true;
}
