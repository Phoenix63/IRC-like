#include "login.h"
#include "ui_login.h"
#include "mainframe.h"
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
        QString host= ui->lineEdit_host->text();
        int port = ui->lineEdit_port->text().toInt(0,10);
        Login::doConnect(host,port);
        main=new MainFrame(this,socket);
        main->show();
}

void Login::doConnect(QString host,int port)
{
    socket = new QTcpSocket(this);
    socket->connectToHost(host,port);
    if(!socket->waitForConnected(5000))
    {
        qDebug() << "Error: " << socket->errorString();
    }
}



