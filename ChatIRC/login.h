#ifndef LOGIN_H
#define LOGIN_H

#include <QDialog>
#include <QObject>
#include <QTcpSocket>
#include <QAbstractSocket>
#include "mainframe.h"

namespace Ui {
class Login;
}

class Login : public QDialog
{
    Q_OBJECT
    
public:
    explicit Login(QWidget *parent = 0);
    void doConnect(QString host,int port);
    ~Login();

public slots:
    void connected();
    void disconnected();
    void bytesWritten(qint64 bytes);
    void readyRead();

private slots:
    void on_pushButton_connect_clicked();

private:
    MainFrame *main;
    QTcpSocket *socket;
    Ui::Login *ui;
};

#endif // LOGIN_H
