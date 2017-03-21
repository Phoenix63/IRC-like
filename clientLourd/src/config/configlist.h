#ifndef CONFIG_CONFIGLIST_H
#define CONFIG_CONFIGLIST_H

#include <QVector>

#include "config.h"

class QFile;
class QString;
class QStringList;

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
    void name(QString newName);
    void pseudo(QString newPseudo);
    void password(QString newPassword);
    void host(QString newHost);
    void port(QString newPort);
    void channels(QStringList newChannels);

	// Getters for current config
    QStringList names();
    int currentIndex();
    QString name();
    QString pseudo();
    QString password();
    QString host();
    QString port();
    QStringList channels();

private:
    int aCurrentIndex;
	QVector<Config> configs;

	void readConfig(QFile *configFile);
};

#endif // CONFIGLIST_H
