#ifndef CHANNELLIST_H
#define CHANNELLIST_H

#include <QDialog>
#include <QString>
#include <QTableWidget>
#include <QTcpSocket>

namespace Ui {
class Channellist;
}

class Channellist : public QDialog
{
    Q_OBJECT

public:
    //Constructor and destructor
    explicit Channellist(QWidget *parent = 0,QTcpSocket *socket = NULL);
    ~Channellist();

    //Ui update functions
    void addRow(QString channel);
    void clear();
private slots:

    void on_tableWidget_doubleClicked(const QModelIndex &index);
private:
    QTcpSocket *socket;
    Ui::Channellist *ui;
    QTableWidget *table;
};

#endif // CHANNELLIST_H
