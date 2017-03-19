#ifndef PARSER_RPL_RESPONSE_H
#define PARSER_RPL_RESPONSE_H

#include <QRegularExpression>

namespace IRC {

namespace RPL {
const QRegularExpression MODEUSER     ("^\\S+\\s221\\s");
const QRegularExpression ISAWAY       ("^\\S+\\s301\\s");
const QRegularExpression SETBACK      ("^\\S+\\s305\\s");
const QRegularExpression SETAWAY      ("^\\S+\\s306\\s");
const QRegularExpression ENDOFWHO     ("^\\S+\\s315\\s");
const QRegularExpression LIST         ("^\\S+\\s(321|322|323)\\s");
const QRegularExpression MODECHAN     ("^\\S+\\s324\\s");
const QRegularExpression CHAN         ("^\\S+\\s(331|332)\\sJOIN\\s");
const QRegularExpression TOPIC        ("^\\S+\\s(331|332)\\sTOPIC\\s");
const QRegularExpression INVITING     ("^\\S+\\s341\\s");
const QRegularExpression WHOREPLY     ("^\\S+\\s352\\s");
const QRegularExpression NAMEREPLY    ("^\\S+\\s353\\s");
const QRegularExpression JOIN         ("^\\S+\\sJOIN\\s");
const QRegularExpression PART         ("^\\S+\\sPART\\s");
const QRegularExpression NICK         ("^\\S+\\sNICK\\s");
const QRegularExpression MOTD         ("^\\S+\\s372\\s");
const QRegularExpression MOTDSTART    ("^\\S+\\s375\\s");
const QRegularExpression ENDOFMOTD    ("^\\S+\\s376\\s");
const QRegularExpression INVITED      ("^\\S+\\s641\\s");
const QRegularExpression PING         ("^\\S+\\sPING\\s");
const QRegularExpression KICK         ("^\\S+\\sKICK\\s");
const QRegularExpression NOTICE       ("^\\S+\\sNOTICE\\sNICK");
const QRegularExpression PRIVMSG      ("^\\S+\\sPRIVMSG\\s#\\S+");
const QRegularExpression WHISPER      ("^\\S+\\sPRIVMSG\\s\\S+");
const QRegularExpression FILELIST	  ("^\\S+\\sLISTFILES\\s\\S+");
const QRegularExpression RMFILE	      ("^\\S+\\sRMFILE\\s\\S+");
}

}

#endif // RPL_RESPONSE_H