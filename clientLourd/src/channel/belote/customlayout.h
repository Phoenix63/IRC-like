#ifndef CUSTOMLAYOUT_H
#define CUSTOMLAYOUT_H

#include <QHash>
#include <QPushButton>
#include <QHBoxLayout>
#include <QString>
class CustomLayout : public QObject
{
    Q_OBJECT
public:
    CustomLayout();
    void setLayout(QHBoxLayout *lay);
    void addButton(QString name, int value);
signals:
    void isClicked(int value, CustomLayout *layout);
public slots:
    void clicked();
private:
QHash<QPushButton *, int> buttons;
QHBoxLayout *layout;
};

#endif // CUSTOMLAYOUT_H
