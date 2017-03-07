#ifndef ERR_RESPONSE_H
#define ERR_RESPONSE_H

#include <QRegularExpression>

namespace IRC {

namespace ERR {
const QRegularExpression NOSUCHNICK           ("^\\S+\\s401\\s");
const QRegularExpression NOSUCHCHANNEL        ("^\\S+\\s403\\s");
const QRegularExpression CANNOTSENDTOCHAN     ("^\\S+\\s404\\s");
const QRegularExpression NORECIPIENT          ("^\\S+\\s411\\s");
const QRegularExpression NOTEXTTOSEND         ("^\\S+\\s412\\s");
const QRegularExpression UNKNOWNCOMMAND       ("^\\S+\\s421\\s");
const QRegularExpression NONICKNAMEGIVEN      ("^\\S+\\s431\\s");
const QRegularExpression NICKNAMEINUSE        ("^\\S+\\s433\\s");
const QRegularExpression NOTONCHANNEL         ("^\\S+\\s442\\s");
const QRegularExpression NOTREGISTERED        ("^\\S+\\s451\\s");
const QRegularExpression NEEDMOREPARAMS       ("^\\S+\\s461\\s");
const QRegularExpression CHANELISFULL         ("^\\S+\\s471\\s");
const QRegularExpression ALREADYREGISTERED    ("^\\S+\\s462\\s");
const QRegularExpression PASSWDMISMATCH       ("^\\S+\\s464\\s");
const QRegularExpression INVITEONLYCHAN       ("^\\S+\\s473\\s");
const QRegularExpression BANNEDFROMCHAN       ("^\\S+\\s474\\s");
const QRegularExpression BADCHANNELKEY        ("^\\S+\\s475\\s");
const QRegularExpression FILESIZE             ("^\\S+\\s601\\s");
}

}

#endif // ERR_RESPONSE_H
