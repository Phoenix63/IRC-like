#include "user.h"

#include <QDebug>
User::User():
aName("notdefined"),
aModeI(false),
aModeO(false),
aModeW(false),
aModeM(false)
{

}

User::User(QString nick):
    aName(nick),
    aModeI(false),
    aModeO(false),
    aModeW(false),
    aModeM(false)
{

}

/*
 * Setters
 */

void User::name(QString name)
{
    aName = name;
}

void User::modeI(bool mode)
{
    aModeI = mode;
}

void User::modeO(bool mode)
{
    aModeO = mode;
}

void User::modeW(bool mode)
{
    aModeW = mode;
}

void User::modeM(bool mode)
{
    aModeM = mode;
}
/*
 * Getters
 */

QString User::name()
{
    return aName;
}

bool User::modeI()
{
    return aModeI;
}

bool User::modeO()
{
    return aModeO;
}

bool User::modeW()
{
    return aModeW;
}

bool User::modeM()
{
    return aModeM;
}
