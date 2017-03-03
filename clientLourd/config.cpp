#include "config.h"

Config::Config():
	name("Default"),
	pseudo("User"),
	password("Password"),
	host("Host"),
	port("Port")
{
}	

/*
 * Setters
 */

void Config::setName(QString newName)
{
	name = newName;
}

void Config::setPseudo(QString newPseudo)
{
	pseudo = newPseudo;
}

void Config::setPassword(QString newPassword)
{
	password = newPassword;
}

void Config::setHost(QString newHost)
{
	host = newHost;
}

void Config::setPort(QString newPort)
{
	port = newPort;
}

void Config::setChannels(QStringList newChannels)
{
	channels = newChannels;
}

/*
 * Getters
 */

QString Config::getName()
{
	return name;
}

QString Config::getPseudo()
{
	return pseudo;
}

QString Config::getPassword()
{
	return password;
}

QString Config::getHost()
{
	return host;
}

QString Config::getPort()
{
	return port;
}

QStringList Config::getChannels()
{
	return channels;
}

