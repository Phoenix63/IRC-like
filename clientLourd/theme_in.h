#ifndef THEME_IN_H
#define THEME_IN_H

#include <QRegularExpression>

namespace IRC {

namespace CFG {

const QRegularExpression NAME_SEP("\\s*=\\s*");
const QRegularExpression LIST_SEP("\\s+");
const QRegularExpression NAME("(<|>)");
const QRegularExpression BACKGROUND("Background");
const QRegularExpression HOUR("Hour");
const QRegularExpression NICK("Nick");
const QRegularExpression SELF("Self");
const QRegularExpression TEXT("Text");
}

}
#endif // THEME_IN_H
