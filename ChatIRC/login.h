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
    bool doConnect();
    bool doConnect(QString username);
    bool doConnect(QString username,QString password);
    ~Login();

private slots:
    void on_pushButton_connect_clicked();
    void on_pushButton_guest_clicked();

private:
    MainFrame *main;
    QTcpSocket *socket;
    Ui::Login *ui;
};

#endif // LOGIN_H
