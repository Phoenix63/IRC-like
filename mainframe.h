#ifndef MAINFRAME_H
#define MAINFRAME_H

<<<<<<< HEAD
#include "channel.h"
#include "parser.h"
#include "msglist.h"

#include <QMainWindow>
#include <QString>
#include <QList>

class QPixmap;
class QTcpSocket;
class QScrollBar;
class QPoint;
template <typename,typename>
class QHash;
class QStringList;
class QFileDialog;
class QStandardPaths;
class Channellist;

=======
#include <QTcpSocket>
#include <QMainWindow>
#include <QString>
#include <QScrollBar>

#include "channel.h"
#include "parseur.h"
#include "msglist.h"

>>>>>>> origin/ClientLourd
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
<<<<<<< HEAD
    //Nickname setter (switch slot implementation ?)
    void setNickname(QString nick);
=======
>>>>>>> origin/ClientLourd

protected:
    bool eventFilter(QObject *obj, QEvent *event);

public slots:
    //Socket slots
    void readyRead();
    void closeEvent (QCloseEvent *event);

    //UI slots
    void on_pushButton_send_clicked();
    void moveScrollBarToBottom(int min, int max);

signals:
	void showLogin();

private slots:
    void on_channelList_itemSelectionChanged();

<<<<<<< HEAD
    void on_actionConnect_triggered();
=======
    void on_messageSender_returnPressed();
>>>>>>> origin/ClientLourd

private:
    Ui::MainFrame *ui;

    //Tcp pointer from login
    QTcpSocket *socket;

    //Parser and channel for message handling
<<<<<<< HEAD
    QString nickname;
    Parser parser;
=======
    Parseur parseur;
>>>>>>> origin/ClientLourd
    Channel channel;
    MsgList msgList;
};

#endif // MAINFRAME_H
