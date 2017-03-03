#ifndef THEME_H
#define THEME_H

#include <QRegularExpression>

namespace IRC {

namespace COLOR {

namespace DARK{
const QString BACKGROUND ("rgb(54, 57, 62);");
const QString HOUR ("rgb(255, 255, 255);");
const QString NAME ("rgb(255, 255, 255);");
const QString SELFNAME ("rgb(255, 255, 255);");
const QString TEXT ("rgb(255, 255, 255);");
}

namespace LIGHT{
const QString BACKGROUND ("rgb(255, 255, 255);");
const QString HOUR ("rgb(115, 115, 115);");
const QString NAME ("rgb(0, 150, 250);");
const QString SELFNAME ("rgb(220, 15, 15);");
const QString TEXT ("rgb(32, 32, 32);");
}

}

}

#endif // THEME_H
