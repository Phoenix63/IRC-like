#include "config.h"

Config::Config():
    aName("Default"),
    aPseudo("User"),
    aPassword("Password"),
    aHost("Host"),
    aPort("Port")
{
}	

/*
 * Setters
 */

void Config::name(QString newName)
{
    aName = newName;
}

void Config::pseudo(QString newPseudo)
{
    aPseudo = newPseudo;
}

void Config::password(QString newPassword)
{
    aPassword = newPassword;
}

void Config::host(QString newHost)
{
    aHost = newHost;
}

void Config::port(QString newPort)
{
    aPort = newPort;
}

void Config::channels(QStringList newChannels)
{
    aChannels = newChannels;
}

/*
 * Getters
 */

QString Config::name()
{
    return aName;
}

QString Config::pseudo()
{
    return aPseudo;
}

QString Config::password()
{
    return aPassword;
}

QString Config::host()
{
    return aHost;
}

QString Config::port()
{
    return aPort;
}

QStringList Config::channels()
{
    return aChannels;
}

