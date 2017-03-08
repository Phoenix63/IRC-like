#ifndef CONFIG_CONFIG_H
#define CONFIG_CONFIG_H

#include <QString>
#include <QStringList>

class Config {
public:
	Config();

	// Setters
    void name(QString newName);
    void pseudo(QString newPseudo);
    void password(QString newPassword);
    void host(QString newHost);
    void port(QString newPort);
    void channels(QStringList newChannels);

	// Getters
    QString name();
    QString pseudo();
    QString password();
    QString host();
    QString port();
    QStringList channels();

private:
    QString aName;
    QString aPseudo;
    QString aPassword;
    QString aHost;
    QString aPort;
    QStringList aChannels;
};

#endif // CONFIG_H
