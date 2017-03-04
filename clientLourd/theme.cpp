#include "theme.h"
#include "theme_in.h"

Theme::Theme():
    aName(IRC::COLOR::LIGHT::NAME),
    aBackground(IRC::COLOR::LIGHT::BACKGROUND),
    aHour(IRC::COLOR::LIGHT::HOUR),
    aNick(IRC::COLOR::LIGHT::NICK),
    aSelf(IRC::COLOR::LIGHT::SELF),
    aText(IRC::COLOR::LIGHT::TEXT)
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
