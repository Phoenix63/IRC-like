#include "theme.h"
#include "theme_in.h"

Theme::Theme() :
    aName(IRC::COLOR::LIGHT::NAME),
    aBackground(IRC::COLOR::LIGHT::BACKGROUND),
    aHour(IRC::COLOR::LIGHT::HOUR),
    aNick(IRC::COLOR::LIGHT::NICK),
    aSelf(IRC::COLOR::LIGHT::SELF),
    aText(IRC::COLOR::LIGHT::TEXT),
    aGradStart(IRC::COLOR::LIGHT::GRADSTART),
    aGradEnd(IRC::COLOR::LIGHT::GRADEND)
{
}

/*
 * Setters
 */
void Theme::name(QString newName)
{
    aName = newName;
}

void Theme::background(QString newBackground)
{
    aBackground = newBackground;
}

void Theme::hour(QString newHour)
{
    aHour = newHour;
}

void Theme::nick(QString newNick)
{
    aNick = newNick;
}

void Theme::self(QString newSelf)
{
    aSelf = newSelf;
}

void Theme::text(QString newText)
{
    aText = newText;
}

void Theme::gradStart(QString newGrad)
{
    aGradStart = newGrad;
}

void Theme::gradEnd(QString newGrad)
{
    aGradEnd = newGrad;
}
/*
 * Getters
 */

QString Theme::name()
{
    return aName;
}

QString Theme::background()
{
    return aBackground;
}

QString Theme::hour()
{
    return aHour;
}

QString Theme::nick()
{
    return aNick;
}

QString Theme::self()
{
    return aSelf;
}

QString Theme::text()
{
    return aText;
}

QString Theme::gradStart()
{
    return aGradStart;
}

QString Theme::gradEnd()
{
    return aGradEnd;
}
