#ifndef GUI_CHANNELLIST_H
#define GUI_CHANNELLIST_H

#include <QDialog>

class QString;
class QTableWidget;
class QTcpSocket;

class ThemeList;

namespace Ui {
class Channellist;
}

class Channellist : public QDialog
{
    Q_OBJECT

public:
    //Constructor and destructor
    explicit Channellist(QWidget *parent = 0,QTcpSocket *socket = NULL);
    void initUIStyle();
    ~Channellist();

    //Ui update functions
    void addRow(QString channel);
    void clear();

private slots:
    void on_tableWidget_doubleClicked(const QModelIndex &index);

private:
    Ui::Channellist *ui;
    QTcpSocket *socket;
    QTableWidget *table;
    ThemeList *theme;
};

#endif // CHANNELLIST_H
