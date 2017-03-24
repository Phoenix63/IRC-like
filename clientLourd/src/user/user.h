#ifndef USER_USER_H
#define USER_USER_H

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
    void modeM(bool mode);

    // Getters
    QString name();
    bool modeI();
    bool modeO();
    bool modeW();
    bool modeM();
private:
    QString aName;
    bool aModeI;
    bool aModeO;
    bool aModeW;
    bool aModeM;
};

#endif // USER_H
