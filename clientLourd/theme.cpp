#include "theme.h"

Theme::Theme():
    aName("Light"),
    aBackground("rgb(255, 255, 255);"),
    aHour("rgb(115, 115, 115);"),
    aNick("rgb(0, 150, 250);"),
    aSelf("rgb(180, 15, 15);"),
    aText("rgb(32, 32, 32);")
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
