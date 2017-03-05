#include "configlist.h"

#include <QFile>
#include <QVector>
#include <QString>
#include <QStringList>
#include <QFile>
#include <QTextStream>

#include "config_in.h"

ConfigList::ConfigList()
{
	configs.append(Config());
    aCurrentIndex = 0;
}

/*
 * Interaction functions
 */

void ConfigList::change(int newIndex)
{
    aCurrentIndex = newIndex;
}

void ConfigList::addConfig()
{
	Config conf;
	configs.append(conf);
    aCurrentIndex = configs.size() - 1;
}

void ConfigList::delConfig()
{

	if (configs.size() > 1) {
        configs.removeAt(aCurrentIndex);
        aCurrentIndex = 0;
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
            out << "<" + i.name() + "> \n";
            out << "User = \"" + i.pseudo() + "\"\n";
            out << "Pass = \"" + i.password() + "\"\n";
            out << "Host = \"" + i.host() + "\"\n";
            out << "Port = \"" + i.port() + "\"\n";
            out << "Channels = ";
            for (auto j:i.channels()) {
                		out << "\"" + j +"\" ";
			}
            out << '\n';
		}
	}
}

/*
 * Setters for current config
 */

void ConfigList::name(QString newName)
{
    configs[aCurrentIndex].name(newName);
}

void ConfigList::pseudo(QString newPseudo)
{
    configs[aCurrentIndex].pseudo(newPseudo);
}

void ConfigList::password(QString newPassword)
{
    configs[aCurrentIndex].password(newPassword);
}

void ConfigList::host(QString newHost)
{
    configs[aCurrentIndex].host(newHost);
}

void ConfigList::port(QString newPort)
{
    configs[aCurrentIndex].port(newPort);
}

void ConfigList::channels(QStringList newChannels)
{
    configs[aCurrentIndex].channels(newChannels);
}

/*
 * Getters for current config
 */

QStringList ConfigList::names()
{
	QStringList nameList;
	for (auto i:configs) {
        nameList.append(i.name());
	}
	return nameList;
}

int ConfigList::currentIndex()
{
    return aCurrentIndex;
}

QString ConfigList::name()
{
    return configs[aCurrentIndex].name();
}

QString ConfigList::pseudo()
{
    return configs[aCurrentIndex].pseudo();
}

QString ConfigList::password()
{
    return configs[aCurrentIndex].password();
}

QString ConfigList::host()
{
    return configs[aCurrentIndex].host();
}

QString ConfigList::port()
{
    return configs[aCurrentIndex].port();
}

QStringList ConfigList::channels()
{
    return configs[aCurrentIndex].channels();
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
                name(lineSplit[0].section(IRC::CFG::NAME, 1, 1));
		} else if (lineSplit.size() > 1) {
			if (lineSplit[0].contains(IRC::CFG::PSEUDO)) {
                pseudo(lineSplit[1].section("\"", 1, 1));
			} else if (lineSplit[0].contains(IRC::CFG::PASSWORD)) {
                password(lineSplit[1].section("\"", 1, 1));
			} else if (lineSplit[0].contains(IRC::CFG::HOST)) {
                host(lineSplit[1].section("\"", 1, 1));
			} else if (lineSplit[0].contains(IRC::CFG::PORT)) {
                port(lineSplit[1].section("\"", 1, 1));
			} else if (lineSplit[0].contains(IRC::CFG::CHANNELS)) {
				QStringList chanList;
				for (auto i:lineSplit[1].split(IRC::CFG::LIST_SEP, QString::SkipEmptyParts)) {
					chanList.append(i.section("\"", 1, 1));
				}
                channels(chanList);
			}
				
		}

	}
}
