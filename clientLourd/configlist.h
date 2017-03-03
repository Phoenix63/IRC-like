#ifndef CONFIGLIST_H
#define CONFIGLIST_H

#include <QVector>
#include "config.h"

class QString;
class QStringList;
class QFile;

class ConfigList {
public:
	ConfigList();

	// Interactions function
	void change(int newIndex);
	void addConfig();
	void delConfig();

	// Config file interactions function
	void loadConfig();
	void saveConfig();

	// Setters for current config
	void setName(QString newName);
	void setPseudo(QString newPseudo);
	void setPassword(QString newPassword);
	void setHost(QString newHost);
	void setPort(QString newPort);
	void setChannels(QStringList newChannels);

	// Getters for current config
	QStringList getNames();
	int getCurrentIndex();
	QString getName();
	QString getPseudo();
	QString getPassword();
	QString getHost();
	QString getPort();
	QStringList getChannels();

private:
	int currentIndex;
	QVector<Config> configs;

	void readConfig(QFile *configFile);
};

#endif // CONFIGLIST_H
