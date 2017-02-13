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
    QString password = ui->lineEdit_pass->text();
    if(username == NULL){
        on_pushButton_guest_clicked();
    }
    else
    {
        if (password == NULL)
            doConnect(username);
        else
            doConnect(username,password);
    }
}


void Login::on_pushButton_guest_clicked()
{
    doConnect();
}


bool Login::doConnect(){
    QString host= ui->lineEdit_host->text();
    int port = ui->lineEdit_port->text().toInt(0,10);
    socket = new QTcpSocket(this);
    socket->connectToHost(host,port);
    if(!socket->waitForConnected(5000))
    {
        qDebug() << "Error: " << socket->errorString();
        QMessageBox::information(this,"Error","Host not found");
        return false;
    }
    else{
        main=new MainFrame(this,socket);
        main->show();
        return true;
    }
}



bool Login::doConnect(QString username){
    if(doConnect())
    {
        QString host= ui->lineEdit_host->text();
        int port = ui->lineEdit_port->text().toInt(0,10);
        main->setWindowTitle(username +"@"+host+":"+QString::number(port));
        QString nick=username;
        nick.prepend("NICK ");
        nick.append('\n');
        socket->write(nick.toLatin1().data());
        QString user=username.prepend("USER "+username+" 0 * : ");
        user.append('\n');
        socket->write(user.toLatin1().data());
        return true;
    }
    return false;
}


bool Login::doConnect(QString username,QString password){
    if(doConnect(username))
    {
        password.prepend("PASS ");
        password.append('\n');
        QByteArray pass=password.toLatin1();
        socket->write(pass.data());
        return true;
    }
    return false;
}
