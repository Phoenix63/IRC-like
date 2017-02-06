#include "mainframe.h"
#include "ui_mainframe.h"
#include <QTcpSocket>
#include <QAbstractSocket>
#include "parseur.h"

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
    QString message = ui->messageSender->text();
        ui->messagePrinter->append(message);
        message.append('\n');
        Parseur::parse(&message);
        QByteArray ba = message.toLatin1();
        socket->write(ba.data());
        ui->messageSender->setText("");
}

void MainFrame::readyRead()
{
    while(socket->canReadLine()){
        char toto[255];
        int t = socket->readLine(toto,255);
        toto[t-1] = '\0';
        toto[0] = ' ';
        ui->messagePrinter->append(toto);
    }
}
