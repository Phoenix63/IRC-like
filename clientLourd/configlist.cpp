#include "configlist.h"

#include <QFile>
#include <QVector>
#include <QString>
#include <QStringList>
#include <QFile>
#include <QDebug>

#include "config_in.h"

ConfigList::ConfigList()
{
	configs.append(Config());
	currentIndex = 0;
}

/*
 * Interaction functions
 */

void ConfigList::change(int newIndex)
{
	currentIndex = newIndex;
}

void ConfigList::addConfig()
{
	Config conf;
	configs.append(conf);
	currentIndex = configs.size() - 1;
}

void ConfigList::delConfig()
{

	if (configs.size() > 1) {
		configs.removeAt(currentIndex);
		currentIndex = 0;
	}
}

/*
 * Config file interactions function
 */

void ConfigList::loadConfig()
{
	while (configs.size() > 1) {
		configs.removeLast();
	}
	QFile configFile("config.cfg");
	if (configFile.exists()) {
		configFile.open(QIODevice::ReadOnly);
		readConfig(&configFile);
	}
}

void ConfigList::saveConfig()
{
	QFile configFile("config.cfg");
	if (configFile.exists()) {
		configFile.open(QIODevice::WriteOnly | QIODevice::Truncate );
		configFile.resize(0);
        QTextStream out(&configFile);
		for (auto i:configs) {
            out << "<" + i.getName() + "> \n";
            out << "User = \"" + i.getPseudo() + "\"\n";
            out << "Pass = \"" + i.getPassword() + "\"\n";
            out << "Host = \"" + i.getHost() + "\"\n";
            out << "Port = \"" + i.getPort() + "\"\n";
            out << "Channels = ";
			for (auto j:i.getChannels()) {
                		out << "\"" + j +"\" ";
			}
            out << "\n";
		}
	}
}

/*
 * Setters for current config
 */

void ConfigList::setName(QString newName)
{
	configs[currentIndex].setName(newName);
}

void ConfigList::setPseudo(QString newPseudo)
{
	configs[currentIndex].setPseudo(newPseudo);
}

void ConfigList::setPassword(QString newPassword)
{
	configs[currentIndex].setPassword(newPassword);
}

void ConfigList::setHost(QString newHost)
{
	configs[currentIndex].setHost(newHost);
}

void ConfigList::setPort(QString newPort)
{
	configs[currentIndex].setPort(newPort);
}

void ConfigList::setChannels(QStringList newChannels)
{
	configs[currentIndex].setChannels(newChannels);
}

/*
 * Getters for current config
 */

QStringList ConfigList::getNames()
{
	QStringList nameList;
	for (auto i:configs) {
		nameList.append(i.getName());
	}
	return nameList;
}

int ConfigList::getCurrentIndex()
{
	return currentIndex;
}

QString ConfigList::getName()
{
	return configs[currentIndex].getName();
}

QString ConfigList::getPseudo()
{
	return configs[currentIndex].getPseudo();
}

QString ConfigList::getPassword()
{
	return configs[currentIndex].getPassword();
}

QString ConfigList::getHost()
{
	return configs[currentIndex].getHost();
}

QString ConfigList::getPort()
{
	return configs[currentIndex].getPort();
}

QStringList ConfigList::getChannels()
{
	return configs[currentIndex].getChannels();
}

/*
 * Private functions
 */

void ConfigList::readConfig(QFile *configFile)
{

	while (!configFile->atEnd()) {
		QString line = configFile->readLine();
		QStringList lineSplit = line.split(IRC::CFG::NAME_SEP, QString::SkipEmptyParts);
		if (lineSplit[0].contains(IRC::CFG::NAME)) {
				addConfig();
				setName(lineSplit[0].section(IRC::CFG::NAME, 1, 1));
		} else if (lineSplit.size() > 1) {
			if (lineSplit[0].contains(IRC::CFG::PSEUDO)) {
				setPseudo(lineSplit[1].section("\"", 1, 1));
			} else if (lineSplit[0].contains(IRC::CFG::PASSWORD)) {
				setPassword(lineSplit[1].section("\"", 1, 1));
			} else if (lineSplit[0].contains(IRC::CFG::HOST)) {
				setHost(lineSplit[1].section("\"", 1, 1));
			} else if (lineSplit[0].contains(IRC::CFG::PORT)) {
				setPort(lineSplit[1].section("\"", 1, 1));
			} else if (lineSplit[0].contains(IRC::CFG::CHANNELS)) {
				QStringList chanList;
				for (auto i:lineSplit[1].split(IRC::CFG::LIST_SEP, QString::SkipEmptyParts)) {
					chanList.append(i.section("\"", 1, 1));
				}
				setChannels(chanList);
			}
				
		}

	}
}
