#ifndef RPL_RESPONSE_H
#define RPL_RESPONSE_H

#include <QRegularExpression>

namespace IRC {

namespace RPL {
const QRegularExpression NAMEREPLY    ("^\\S+\\s353\\s");
const QRegularExpression WHOREPLY     ("^\\S+\\s352\\s");
const QRegularExpression ENDOFWHO     ("^\\S+\\s315\\s");
const QRegularExpression NOTOPIC      ("^\\S+\\s331\\sJOIN\\s");
const QRegularExpression TOPIC        ("^\\S+\\s332\\sJOIN\\s");
const QRegularExpression JOIN         ("^\\S+\\sJOIN\\s");
const QRegularExpression PART         ("^\\S+\\sPART\\s");
const QRegularExpression LISTSTART    ("^\\S+\\s321\\s");
const QRegularExpression LIST         ("^\\S+\\s322\\s");
const QRegularExpression LISTEND      ("^\\S+\\s323\\s");
const QRegularExpression NICK         ("^\\S+\\sNICK\\s");
const QRegularExpression NOTICE       ("^\\S+\\sNOTICE\\sNICK");
const QRegularExpression PRIVMSG      ("^\\S+\\sPRIVMSG\\s#\\S+");
const QRegularExpression WHISPER      ("^\\S+\\sPRIVMSG\\s\\S+");
const QRegularExpression MOTDSTART    ("^\\S+\\s375\\s");
const QRegularExpression MOTD         ("^\\S+\\s372\\s");
const QRegularExpression ENDOFMOTD    ("^\\S+\\s376\\s");
const QRegularExpression PING         ("^\\S+\\sPING\\s");
const QRegularExpression KICK         ("^\\S+\\sKICK\\s");
}

}

#endif // RPL_RESPONSE_H
