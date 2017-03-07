#include "user.h"


User::User():
aName("notdefined"),
aModeI(false),
aModeO(false),
aModeW(false)
{

}

User::User(QString nick):
    aName(nick),
    aModeI(false),
    aModeO(false),
    aModeW(false)
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
