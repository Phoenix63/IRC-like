#include "themelist.h"

#include <QFile>

#include "theme_in.h"

ThemeList *ThemeList::aInstance = nullptr;

ThemeList * ThemeList::instance()
{
    if (!aInstance)
        aInstance = new ThemeList();
    return aInstance;
}

void ThemeList::deleteInstance()
{
    delete aInstance;
    aInstance = nullptr;
}

ThemeList::ThemeList()
{
    themes.append(Theme());
    themes.append(Theme());
    change(1);
    name(IRC::COLOR::DARK::NAME);
    background(IRC::COLOR::DARK::BACKGROUND);
    hour(IRC::COLOR::DARK::HOUR);
    nick(IRC::COLOR::DARK::NICK);
    self(IRC::COLOR::DARK::SELF);
    text(IRC::COLOR::DARK::TEXT);
    gradStart(IRC::COLOR::DARK::GRADSTART);
    gradEnd(IRC::COLOR::DARK::GRADEND);
    loadTheme();
}


void ThemeList::change(int newIndex)
{
    aCurrentIndex = newIndex;
}
void ThemeList::addTheme()
{
    Theme theme;
    themes.append(theme);
    aCurrentIndex = themes.size() - 1;
}

void ThemeList::loadTheme()
{
    while(themes.size() > 2){
        themes.removeLast();
    }
    QFile themeFile("ressources/theme.cfg");
    if (themeFile.exists()) {
        themeFile.open(QIODevice::ReadOnly);
        readTheme(&themeFile);
    }
}

/*
 * Setters for current Theme
 */
void ThemeList::currentIndex(int newIndex)
{
    aCurrentIndex = newIndex;
}

void ThemeList::name(QString newName)
{
    themes[aCurrentIndex].name(newName);
}

void ThemeList::background(QString newBackground)
{
    themes[aCurrentIndex].background(newBackground);
}

void ThemeList::hour(QString newHour)
{
    themes[aCurrentIndex].hour(newHour);
}

void ThemeList::nick(QString newNick)
{
    themes[aCurrentIndex].nick(newNick);
}

void ThemeList::self(QString newSelf)
{
    themes[aCurrentIndex].self(newSelf);
}

void ThemeList::text(QString newText)
{
    themes[aCurrentIndex].text(newText);
}

void ThemeList::gradStart(QString newGrad)
{
    themes[aCurrentIndex].gradStart(newGrad);
}

void ThemeList::gradEnd(QString newGrad)
{
    themes[aCurrentIndex].gradEnd(newGrad);
}
/*
 * Getters for current theme
 */

QStringList ThemeList::names()
{
    QStringList nameList;
    for (auto i:themes) {
        nameList.append(i.name());
    }
    return nameList;
}

int ThemeList::currentIndex()
{
    return aCurrentIndex;
}

QString ThemeList::background()
{
    return themes[aCurrentIndex].background();
}

QString ThemeList::hour()
{
    return themes[aCurrentIndex].hour();
}

QString ThemeList::nick()
{
    return themes[aCurrentIndex].nick();
}

QString ThemeList::self()
{
    return themes[aCurrentIndex].self();
}

QString ThemeList::text()
{
    return themes[aCurrentIndex].text();
}

QString ThemeList::gradStart()
{
    return themes[aCurrentIndex].gradStart();
}

QString ThemeList::gradEnd()
{
    return themes[aCurrentIndex].gradEnd();
}
//Private functions

void ThemeList::readTheme(QFile *themefile)
{
    while (!themefile->atEnd()) {
        QString line = themefile->readLine();
        QStringList lineSplit = line.split(IRC::CFG::NAME_SEP, QString::SkipEmptyParts);
        if (lineSplit[0].contains(IRC::CFG::NAME)) {
            addTheme();
            name(lineSplit[0].section(IRC::CFG::NAME, 1, 1));
        } else if (lineSplit.size() > 1) {
            if (lineSplit[0].contains(IRC::CFG::BACKGROUND)) {
                background(lineSplit[1].section("\"", 1, 1));
            } else if (lineSplit[0].contains(IRC::CFG::HOUR)) {
                hour(lineSplit[1].section("\"", 1, 1));
            } else if (lineSplit[0].contains(IRC::CFG::NICK)) {
                nick(lineSplit[1].section("\"", 1, 1));
            } else if (lineSplit[0].contains(IRC::CFG::SELF)) {
                self(lineSplit[1].section("\"", 1, 1));
            } else if (lineSplit[0].contains(IRC::CFG::TEXT)) {
                text(lineSplit[1].section("\"", 1, 1));
            } else if (lineSplit[0].contains(IRC::CFG::CURRENT)){
                currentIndex(lineSplit[1].section("\"", 1, 1).toInt());
            }
        }
    }
}
