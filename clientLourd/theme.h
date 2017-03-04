#ifndef THEME_H
#define THEME_H

#include <QRegularExpression>
#include <QString>

class Theme {
public:
    Theme();

    //Setters
    void name(QString newName);
    void background(QString newBackground);
    void hour(QString newHour);
    void nick(QString newNick);
    void self(QString newSelf);
    void text(QString newText);

    //Getters
    QString name();
    QString background();
    QString hour();
    QString nick();
    QString self();
    QString text();
private:
    QString aName;
    QString aBackground;
    QString aHour;
    QString aNick;
    QString aSelf;
    QString aText;
};
#endif // THEME_H
