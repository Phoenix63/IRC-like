#include "mainframe.h"
#include "ui_mainframe.h"
#include <QTcpSocket>
#include <QAbstractSocket>
#include "parseur.h"
#include "channel.h"

MainFrame::MainFrame(QWidget *parent,QTcpSocket *socket) :
    QDialog(parent),
    ui(new Ui::MainFrame),
    socket(socket),
    channelName("\"Debug\"")
{
    ui->setupUi(this);
    connect(socket, SIGNAL(readyRead()),this, SLOT(readyRead()));
    connect(&parseur_out, SIGNAL(quit_signal()), this, SLOT(test()));
    channel.setParseurIn(&parseur_in);
    channel.setParseurOut(&parseur_out);
    channel.setList(ui->channelList);
    channel.setChanText(ui->messagePrinter);
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
        if (channelName!="\"Debug\"")
            message.prepend(channelName.toLatin1() +" :");
        parseur_out.parse(&message);
        socket->write(message.toLatin1().data());
        ui->messageSender->setText("");
}


void MainFrame::readyRead()
{
    while(socket->canReadLine()){
            QString string = QString(socket->readLine());
            parseur_in.parse(string);
        }
}

void MainFrame::test()
{
    qDebug() << "quit";
}

void MainFrame::on_channelList_itemSelectionChanged()
{
    channel.change(ui->channelList->currentItem()->text());
    channelName = ui->channelList->currentItem()->text();
}
