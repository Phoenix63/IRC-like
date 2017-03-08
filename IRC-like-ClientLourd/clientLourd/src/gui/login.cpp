#include "login.h"

#include <QListWidget>
#include <QListWidgetItem>
#include <QMessageBox>
#include <QStringList>
#include <QTcpSocket>

#include "mainframe.h"
#include "ui_login.h"
#include "../config/themelist.h"
/*
 * Constructor and destructor
 */

Login::Login(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Login),
    main(nullptr),
    socket(nullptr)

{
    ui->setupUi(this);
	config.loadConfig();
    loadPresetList();
    initUIStyle();
}

void Login::initUIStyle()
{
    theme = ThemeList::instance();
    this->setStyleSheet("background-color : " + theme->background() + ';' + " color : " + theme->text() + ';');
}

Login::~Login()
{
    delete ui;
    delete main;
    delete socket;
}

void Login::closeEvent (QCloseEvent *event)
{
     event->accept();
}

/*
 * Connection to server
 */
bool Login::doConnect()
{
    QString host= ui->lineEdit_host->text();
    int port = ui->lineEdit_port->text().toInt(0,10);
    socket = new QTcpSocket(this);
    socket->connectToHost(host,port);
    if(!socket->waitForConnected(5000))
    {
        QMessageBox::information(this, "Error", "Host not found");
        return false;
    } else {
        main = new MainFrame(NULL, socket, host);
        connect(main, &MainFrame::showLogin, this, &Login::show);
        main->show();
        main->setWindowTitle("Guest@" + host + ":" + QString::number(port));
		hide();
		return true;
    }
}

void Login::sendInfos()
{
    QString host = ui->lineEdit_host->text();
    int port = ui->lineEdit_port->text().toInt(0, 10);
    QString username = ui->lineEdit_username->text();
    main->setWindowTitle(username + "@" + host + ":" + QString::number(port));
    QString nick = username;
    nick.prepend("NICK ");
    nick.append('\n');
    socket->write(nick.toUtf8());
    QString user = username.prepend("USER " + username  +" 0 * :");
    user.append('\n');
    socket->write(user.toUtf8());
}

/*
 * Connection buttons slots
 */

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
                socket->write(password.toUtf8());
            }
            sendInfos();
            while (socket->waitForReadyRead(0));
            joinChannels(ui->channelList);
        }
    }
}

void Login::on_pushButton_guest_clicked()
{
    doConnect();
}

void Login::displayLogin()
{
    show();
    activateWindow();
    raise();
}

/*
 * Channel functions
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

QStringList Login::convertChannelList(QListWidget *channels)
{
    QStringList channelsToJoin;
    for(int i = 0; i < channels->count(); i++)
        channelsToJoin.append(channels->item(i)->text());
    return channelsToJoin;
}

void Login::joinChannels(QListWidget *channels)
{
    QStringList channelsToJoin = convertChannelList(channels);
    for(int i = 0; i < channelsToJoin.size() ; i++)
    {
        QString chan = channelsToJoin.at(i);
        chan.append('\n');
        chan.prepend("JOIN ");
        socket->write(chan.toUtf8());
    }
}

/*
 * Preset functions
 */

void Login::loadPreset()
{
        ui->presetList->setCurrentIndex(config.currentIndex());
        ui->lineEdit_username->setText(config.pseudo());
        ui->lineEdit_pass->setText(config.password());
        ui->lineEdit_host->setText(config.host());
        ui->lineEdit_port->setText(config.port());
		ui->channelList->clear();
        for (auto i:config.channels()) {
			ui->channelList->addItem(i);
		}
}

void Login::loadPresetList()
{

	ui->presetList->clear();
   for (auto i:config.names()) {
		   ui->presetList->addItem(i);
   }
   loadPreset();
}

void Login::on_pushButton_newPreset_clicked()
{
	config.addConfig();
	loadPresetList();
}

void Login::on_presetList_activated(const QString &arg1)
{
    ui->channelList->clear();
	loadPresetList();
	config.change(ui->presetList->findText(arg1));
    loadPreset();
}

void Login::on_pushButton_savePreset_clicked()
{
        config.name(ui->lineEdit_username->text() + "-" + ui->lineEdit_host->text() + ":" + ui->lineEdit_port->text());
        config.pseudo(ui->lineEdit_username->text());
        config.password(ui->lineEdit_pass->text());
        config.host(ui->lineEdit_host->text());
        config.port(ui->lineEdit_port->text());
		QStringList chanList;
        for (int i = 0; i < ui->channelList->count(); i++) {
                chanList.append(ui->channelList->item(i)->text());
	}
    config.channels(chanList);
        config.saveConfig();
	loadPresetList();
}

void Login::on_pushButton_deletePreset_clicked()
{
	config.delConfig();
	config.saveConfig();
	loadPresetList();
}
