#ifndef THEME_IN_H
#define THEME_IN_H

#include <QRegularExpression>

namespace IRC {

namespace CFG {
const QRegularExpression NAME_SEP("\\s*=\\s*");
const QRegularExpression LIST_SEP("\\s+");
const QRegularExpression CURRENT("Current");
const QRegularExpression NAME("(<|>)");
const QRegularExpression BACKGROUND("Background");
const QRegularExpression HOUR("Hour");
const QRegularExpression NICK("Nick");
const QRegularExpression SELF("Self");
const QRegularExpression TEXT("Text");
}
namespace COLOR{
	
namespace DARK{
const QString NAME ("DARK");
const QString BACKGROUND ("rgb(54, 57, 62);");
const QString HOUR ("rgb(150, 150, 150);");
const QString NICK ("rgb(0, 130, 170);");
const QString SELF ("rgb(160, 60, 60);");
const QString TEXT ("rgb(235, 235, 235);");
}

namespace LIGHT{
const QString NAME ("LIGHT");
const QString BACKGROUND ("rgb(255, 255, 255);");
const QString HOUR ("rgb(115, 115, 115);");
const QString NICK ("rgb(0, 130, 170);");
const QString SELF ("rgb(160, 60, 60);");
const QString TEXT ("rgb(32, 32, 32);");
}

}

}
#endif // THEME_IN_H
