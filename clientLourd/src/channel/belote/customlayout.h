#ifndef CHANNEL_BELOTE_CUSTOMLAYOUT_H
#define CHANNEL_BELOTE_CUSTOMLAYOUT_H

#include <QHash>
#include <QHBoxLayout>
#include <QPushButton>
#include <QString>

class CustomLayout : public QObject
{
    Q_OBJECT
public:
    CustomLayout();
    ~CustomLayout();
    void setLayout(QHBoxLayout *lay, QWidget *parent);
    void addButton(QString name, int value);
    void clearLayout(QLayout *layout);
signals:
    void isClicked(int value, CustomLayout *layout);
public slots:
    void clicked();
private:
QWidget *parent;
QHash<QPushButton *, int> buttons;
QHBoxLayout *layout;
};

#endif // CUSTOMLAYOUT_H
