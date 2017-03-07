#ifndef CONFIG_CONFIG_IN_H
#define CONFIG_CONFIG_IN_H

#include <QRegularExpression>

namespace IRC {

namespace CFG {

const QRegularExpression NAME_SEP("\\s*=\\s*");
const QRegularExpression LIST_SEP("\\s+");
const QRegularExpression NAME("(<|>)");
const QRegularExpression PSEUDO("User");
const QRegularExpression PASSWORD("Pass");
const QRegularExpression HOST("Host");
const QRegularExpression PORT("Port");
const QRegularExpression CHANNELS("Channels");
}

}

#endif // CONFIG_IN_H
