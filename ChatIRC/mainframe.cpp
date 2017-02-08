#include "mainframe.h"
#include "ui_mainframe.h"
#include <QTcpSocket>
#include <QAbstractSocket>
#include "parseur.h"
#include "channel.h"

MainFrame::MainFrame(QWidget *parent,QTcpSocket *socket) :
    QDialog(parent),
    ui(new Ui::MainFrame),
    socket(socket)
{
    ui->setupUi(this);
    connect(socket, SIGNAL(readyRead()),this, SLOT(readyRead()));
    channel.setList(ui->channelList);
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
        socket->write(message.toLatin1().data());
        ui->messageSender->setText("");
}


void MainFrame::readyRead()
{
    while(socket->canReadLine()){
            QString string = QString(socket->readLine());

            // Get rid of spaces and \n
            string = string.left(string.length() - 1);
            string = string.right(string.length() - 1);

            //Parse the message starting from error code to detect server name
            int i = string.indexOf(' ');
            QString cmd = string.right(string.length() - i - 1);
            if (cmd.startsWith("331") || cmd.startsWith("332"))
                channel.update(cmd);
            else
                ui->messagePrinter->append(string);
        }
}
