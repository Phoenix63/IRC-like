#include "login.h"
#include "ui_login.h"

Login::Login(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Login)
{
    ui->setupUi(this);
}

Login::~Login()
{
    delete ui;
}
void Login::doConnect(QString host,int port)
{
    socket = new QTcpSocket(this);

    connect(socket, SIGNAL(connected()),this, SLOT(connected()));
    connect(socket, SIGNAL(disconnected()),this, SLOT(disconnected()));
    connect(socket, SIGNAL(bytesWritten(qint64)),this, SLOT(bytesWritten(qint64)));
    connect(socket, SIGNAL(readyRead()),this, SLOT(readyRead()));

    qDebug() << "connecting...";

    // this is not blocking call
    socket->connectToHost("localhost", 1234);

    // we need to wait...
    if(!socket->waitForConnected(5000))
    {
        qDebug() << "Error: " << socket->errorString();
    }
}

void Login::on_pushButton_clicked()
{
//    QString host= ui->lineEdit_host->text();
//    int port = ui->lineEdit_port->text().toInt(0,10);
    Login::doConnect("localhost",1234);
}
void Login::connected()
{
    qDebug() << "connected...";

    // Hey server, tell me about you.
    socket->write("Bonjour\n");
}

void Login::disconnected()
{
    qDebug() << "disconnected...";
}

void Login::bytesWritten(qint64 bytes)
{
    qDebug() << bytes << " bytes written...";
}

void Login::readyRead()
{
    qDebug() << "reading...";

    // read the data from the socket
    qDebug() << socket->readAll();
}
