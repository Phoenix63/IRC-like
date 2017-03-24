#ifndef CHANNEL_BELOTE_RPL_RESPONSE_H
#define CHANNEL_BELOTE_RPL_RESPONSE_H

#include <QRegularExpression>

namespace BELOTE {

namespace RPL {
const QRegularExpression TEAMSELEC    ("^BELOTE\\s\\S+\\s1001\\s");
const QRegularExpression GAMESTART    ("^BELOTE\\s\\S+\\s1002\\s");
const QRegularExpression TEAMPOINTS   ("^BELOTE\\s\\S+\\s1004\\s");
const QRegularExpression GAMERESET    ("^BELOTE\\s\\S+\\s1005\\s");
const QRegularExpression RECEIVED     ("^BELOTE\\s\\S+\\s1006\\s");
const QRegularExpression ROUNDEND     ("^BELOTE\\s\\S+\\s1007\\s");
const QRegularExpression TRUMPIS      ("^BELOTE\\s\\S+\\s1008\\s");
const QRegularExpression PLAYERTAKE   ("^BELOTE\\s\\S+\\s1009\\s");
const QRegularExpression YOURTURN     ("^BELOTE\\s\\S+\\s1010\\s");
const QRegularExpression TURNTOTAKE   ("^BELOTE\\s\\S+\\s1011\\s");
const QRegularExpression DIDNTTAKE    ("^BELOTE\\s\\S+\\s1012\\s");
const QRegularExpression PLAYED       ("^BELOTE\\s\\S+\\s1013\\s");
const QRegularExpression TEAMJOIN     ("^BELOTE\\s\\S+\\s1014\\s");
const QRegularExpression ROUNDSTART   ("^BELOTE\\s\\S+\\s1015\\s");
const QRegularExpression TEAMWIN      ("^BELOTE\\s\\S+\\s1016\\s");
const QRegularExpression ENDFOLD      ("^BELOTE\\s\\S+\\s1017\\s");
}

namespace ERR {
const QRegularExpression NOTINGAME    ("^BELOTE\\s\\S+\\s1101\\s");
const QRegularExpression INVALIDTEAM  ("^BELOTE\\s\\S+\\s1102\\s");
const QRegularExpression NOTYOURTURN  ("^BELOTE\\s\\S+\\s1103\\s");
const QRegularExpression INVALIDCOLOR ("^BELOTE\\s\\S+\\s1104\\s");
const QRegularExpression ISCOW        ("^BELOTE\\s\\S+\\s1105\\s");
const QRegularExpression WRONGCOLOR   ("^BELOTE\\s\\S+\\s1106\\s");
const QRegularExpression INVALIDCARD  ("^BELOTE\\s\\S+\\s1107\\s");
const QRegularExpression DONTHAVETHIS ("^BELOTE\\s\\S+\\s1108\\s");
const QRegularExpression FULLTEAM     ("^BELOTE\\s\\S+\\s1109\\s");
}

}
#endif // RPL_RESPONSE_H
