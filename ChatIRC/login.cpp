#include "login.h"
#include "ui_login.h"
#include "mainframe.h"
#include <string.h>
#include <QMessageBox>

Login::Login(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Login)
{
    ui->setupUi(this);
}

Login::~Login()
{
    delete ui;
    delete main;
}


void Login::on_pushButton_connect_clicked()
{
    QString username = ui->lineEdit_username->text();
    if(username == NULL){
        Login::on_pushButton_guest_clicked();
    }
    else{
        QString host= ui->lineEdit_host->text();
        int port = ui->lineEdit_port->text().toInt(0,10);
        if(Login::doConnect(host,port,username)){
            main=new MainFrame(this,socket);
            main->setWindowTitle(username +"@"+host+":"+QString::number(port));
            main->show();
        }
        else{
            QMessageBox::information(this,"Error","Host not found");
        }
    }
}


void Login::on_pushButton_guest_clicked()
{
    QString host= ui->lineEdit_host->text();
    int port = ui->lineEdit_port->text().toInt(0,10);
    socket = new QTcpSocket(this);
    socket->connectToHost(host,port);
    if(!socket->waitForConnected(5000))
    {
        qDebug() << "Error: " << socket->errorString();
        QMessageBox::information(this,"Error","Host not found");
    }
    else{
        main=new MainFrame(this,socket);
        main->show();
    }
}


bool Login::doConnect(QString host,int port,QString username)
{
    socket = new QTcpSocket(this);
    socket->connectToHost(host,port);
    if(!socket->waitForConnected(5000))
    {
        qDebug() << "Error: " << socket->errorString();
        return false;
    }
    else
    {
        QString nick = username;
        username.prepend("NICK ");
        username.append('\n');
        QByteArray nickname=username.toLatin1();
        socket->write(nickname.data());
        nick.prepend("USER "+nick+" 0 * : ");
        nick.append('\n');
        QByteArray user =nick.toLatin1();
        socket->write(user.data());
        return true;
    }
}
