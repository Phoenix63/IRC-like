#ifndef CHANNELLIST_H
#define CHANNELLIST_H

#include <QDialog>
#include <QString>
#include <QDebug>

namespace Ui {
class Channellist;
}

class Channellist : public QDialog
{
    Q_OBJECT

public:
    explicit Channellist(QWidget *parent = 0);
    ~Channellist();
    void addRow(QString channel);
private slots:

private:
    Ui::Channellist *ui;
};

#endif // CHANNELLIST_H
