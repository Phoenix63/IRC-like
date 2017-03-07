#ifndef USER_H
#define USER_H

#include <QList>
#include <QString>

class User
{
public:
    User();
    User(QString nick);

    // Setters
    void name(QString name);
    void modeI(bool mode);
    void modeO(bool mode);
    void modeW(bool mode);

    // Getters
    QString name();
    bool modeI();
    bool modeO();
    bool modeW();
private:
    QString aName;
    bool aModeI;
    bool aModeO;
    bool aModeW;
};

#endif // USER_H
