#include "mainframe.h"
#include "ui_mainframe.h"
#include <QTcpSocket>
#include <QAbstractSocket>


MainFrame::MainFrame(QWidget *parent,QTcpSocket *socket) :
    QDialog(parent),
    ui(new Ui::MainFrame),
    socket(socket)
{
    ui->setupUi(this);
    connect(socket, SIGNAL(readyRead()),this, SLOT(readyRead()));
}

MainFrame::~MainFrame()
{
    delete ui;
    delete socket;
}

void MainFrame::on_pushButton_send_clicked()
{

    QString message = ui->lineEdit_message->text();
    message.append('\n');
    QByteArray ba = message.toLatin1();
    socket->write(ba.data());
    ui->lineEdit_message->setText("");
}

void MainFrame::readyRead()
{
    QString message(socket->readLine(255));
    message = message.left(message.length() - 1);
    ui->textBrowser_messageLog->append(message);
}
