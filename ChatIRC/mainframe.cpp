#include "mainframe.h"
#include "ui_mainframe.h"


/*
 * Mainframe: constructor
 */

MainFrame::MainFrame(QWidget *parent,QTcpSocket *socket) :
    QDialog(parent),
    ui(new Ui::MainFrame),
    socket(socket)
{
    ui->setupUi(this);
    connect(socket, SIGNAL(readyRead()),this, SLOT(readyRead()));
    channel.setUi(ui->channelList, ui->messagePrinter,ui->userList,ui->topicDisplay);
    parseur.setChannel(&channel);
}

/*
 * MainFrame: destructor
 */

MainFrame::~MainFrame()
{
    delete ui;
    delete socket;
}

/*
 * MainFrame: socket slots
 */

void MainFrame::readyRead()
{
    while(socket->canReadLine()){
            QString string = QString(socket->readLine());
            parseur.in(string);
        }
}

/*
 * mainFrame: UI slots
 */

void MainFrame::on_pushButton_send_clicked()
{
    QString message = ui->messageSender->text();
    ui->messagePrinter->append(message);
    message.append('\n');
    parseur.out(&message);
    socket->write(message.toLatin1().data());
    ui->messageSender->setText("");
}

void MainFrame::on_channelList_itemSelectionChanged()
{
    channel.change(ui->channelList->currentItem()->text());
}

