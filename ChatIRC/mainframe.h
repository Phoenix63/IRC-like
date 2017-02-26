#ifndef MAINFRAME_H
#define MAINFRAME_H

#include <QTcpSocket>
#include <QMainWindow>
#include <QString>
#include <QScrollBar>

#include "channel.h"
#include "parseur.h"
#include "msglist.h"

namespace Ui {
class MainFrame;
}

class MainFrame : public QMainWindow
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
    void closeEvent (QCloseEvent *event);

    //UI slots
    void moveScrollBarToBottom(int min, int max);

private slots:
    void on_channelList_itemSelectionChanged();
    void on_messageSender_returnPressed();

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
