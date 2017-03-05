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
    void gradStart(QString newGrad);
    void gradEnd(QString newGrad);

    //Getters
    QString name();
    QString background();
    QString hour();
    QString nick();
    QString self();
    QString text();
    QString gradStart();
    QString gradEnd();
private:
    QString aName;
    QString aBackground;
    QString aHour;
    QString aNick;
    QString aSelf;
    QString aText;
    QString aGradStart;
    QString aGradEnd;
};

#endif // THEME_H
