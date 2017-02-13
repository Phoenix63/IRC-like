#ifndef MAINFRAME_H
#define MAINFRAME_H

#include <QTcpSocket>
#include <QDialog>
#include <QString>

#include "channel.h"
#include "parseur.h"
#include "msglist.h"

namespace Ui {
class MainFrame;
}

class MainFrame : public QDialog
{
    Q_OBJECT

public:
    //Constructor and Destructor
    explicit MainFrame(QWidget *parent = 0,QTcpSocket *socket=NULL);
    ~MainFrame();

protected:
    bool eventFilter(QObject *obj, QEvent *event);

public slots:
    //Socket slots
    void readyRead();

    //UI slots
    void on_pushButton_send_clicked();

private slots:
    void on_channelList_itemSelectionChanged();

private:
    Ui::MainFrame *ui;

    //Tcp pointer from login
    QTcpSocket *socket;

    //Parser and channel for message handling
    Parseur parseur;
    Channel channel;
    MsgList msgList;
};

#endif // MAINFRAME_H
