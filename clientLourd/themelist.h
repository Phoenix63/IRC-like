#ifndef THEMELIST_H
#define THEMELIST_H

#include <QVector>
#include <QFile>
#include "theme.h"

class ThemeList {
public:
    ThemeList();

    void change(int newIndex);
    void addTheme();
    void loadTheme();

    //Setters for current theme
    void name(QString newName);
    void background(QString newBackground);
    void hour(QString newHour);
    void nick(QString newName);
    void self(QString newSelf);
    void text(QString newText);

    //Getters for current theme
    QStringList names();
    int currentIndex();
    QString name();
    QString background();
    QString hour();
    QString nick();
    QString self();
    QString text();

private:
    int aCurrentIndex;
    QVector<Theme> themes;

    void readTheme(QFile *themefile);
};

#endif // THEMELIST_H
