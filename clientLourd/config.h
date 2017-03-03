#ifndef CONFIG_H
#define CONFIG_H

#include <QString>
#include <QStringList>

class Config {
public:
	Config();

	// Setters
	void setName(QString newName);
	void setPseudo(QString newPseudo);
	void setPassword(QString newPassword);
	void setHost(QString newHost);
	void setPort(QString newPort);
	void setChannels(QStringList newChannels);

	// Getters
	QString getName();
	QString getPseudo();
	QString getPassword();
	QString getHost();
	QString getPort();
	QStringList getChannels();

private:
	QString name;
	QString pseudo;
	QString password;
	QString host;
	QString port;
	QStringList channels;
};

#endif // CONFIG_H
