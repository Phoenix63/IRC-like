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
    if(doConnect())
    {
        if(username != NULL)
        {
            if(password != NULL)
            {
                password.prepend("PASS ");
                password.append('\n');
                socket->write(password.toLatin1().data());
            }
            sendInfos();
            while (!socket->waitForReadyRead());
            joinChannels(ui->channelList);
        }
    }
}


void Login::on_pushButton_guest_clicked()
{
    doConnect();
}


/*
 * Establish connection with server
 */
bool Login::doConnect()
{
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
        main->setWindowTitle("Guest@"+host+":"+QString::number(port));
        return true;
    }
}

/*
 * Send informations about identity
 */
void Login::sendInfos()
{
    QString host= ui->lineEdit_host->text();
    int port = ui->lineEdit_port->text().toInt(0,10);
    QString username=ui->lineEdit_username->text();
    main->setWindowTitle(username +"@"+host+":"+QString::number(port));
    QString nick=username;
    nick.prepend("NICK ");
    nick.append('\n');
    socket->write(nick.toLatin1().data());
    QString user=username.prepend("USER "+username+" 0 * :");
    user.append('\n');
    socket->write(user.toLatin1().data());
}


/*
 * List of channels to join interactions
 */
void Login::on_pushButton_addChannel_clicked()
{
    ui->channelList->addItem("#general");
}

void Login::on_pushButton_deleteChannel_clicked()
{
    ui->channelList->takeItem(ui->channelList->currentRow());
}

void Login::on_channelList_itemClicked(QListWidgetItem *item)
{
    item->setFlags(item->flags() | Qt::ItemIsEditable);
    ui->channelList->editItem(item);
}



QList<QString>* Login::convertChannelList(QListWidget *channels){
    QList<QString> *channelsToJoin=new QList<QString>;
    for(int i = 0; i < channels->count(); i++)
        channelsToJoin->append(channels->item(i)->text());
    return channelsToJoin;
}


void Login::joinChannels(QListWidget *channels)
{
    QList<QString>* channelsToJoin=convertChannelList(channels);
    for(int i = 0; i < channelsToJoin->size() ; i++)
    {
        QString chan = channelsToJoin->at(i);
        chan.append('\n');
        chan.prepend("JOIN ");
        socket->write(chan.toLatin1().data());
    }
}
