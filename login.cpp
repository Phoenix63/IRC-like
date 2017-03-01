#include "login.h"
#include "ui_login.h"
#include "mainframe.h"


#include <QListWidgetItem>
#include <QFile>
#include <QMessageBox>

/*
 * Constructor and destructor
 */

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

void Login::closeEvent (QCloseEvent *event)
{
<<<<<<< HEAD
     event->accept();
=======
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
>>>>>>> origin/ClientLourd
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
        qDebug() << "Error: " << socket->errorString();
        QMessageBox::information(this, "Error", "Host not found");
        return false;
    }
    else{
<<<<<<< HEAD
        main = new MainFrame(NULL,socket);
        connect(main, &MainFrame::showLogin, this, &Login::show);
=======
        main=new MainFrame(this,socket);
>>>>>>> origin/ClientLourd
        main->show();
        main->setWindowTitle("Guest@" + host + ":" + QString::number(port));
		hide();
		return true;
    }
}

void Login::sendInfos()
{
<<<<<<< HEAD
    QString host = ui->lineEdit_host->text();
    int port = ui->lineEdit_port->text().toInt(0, 10);
    QString username = ui->lineEdit_username->text();
    main->setWindowTitle(username + "@" + host + ":" + QString::number(port));
    main->setNickname(username);
    QString nick = username;
    nick.prepend("NICK ");
    nick.append('\n');
    socket->write(nick.toUtf8());
    QString user = username.prepend("USER " + username  +" 0 * :");
=======
    QString host= ui->lineEdit_host->text();
    int port = ui->lineEdit_port->text().toInt(0,10);
    QString username=ui->lineEdit_username->text();
    main->setWindowTitle(username +"@"+host+":"+QString::number(port));
    QString nick=username;
    nick.prepend("NICK ");
    nick.append('\n');
    socket->write(nick.toLatin1().data());
    QString user=username.prepend("USER "+username+" 0 * :");
>>>>>>> origin/ClientLourd
    user.append('\n');
    socket->write(user.toLatin1().data());
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
            while (!socket->waitForReadyRead(-1));
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

<<<<<<< HEAD
QList<QString>* Login::convertChannelList(QListWidget *channels)
{
    QList<QString> *channelsToJoin = new QList<QString>;
=======


QList<QString>* Login::convertChannelList(QListWidget *channels){
    QList<QString> *channelsToJoin=new QList<QString>;
>>>>>>> origin/ClientLourd
    for(int i = 0; i < channels->count(); i++)
        channelsToJoin->append(channels->item(i)->text());
    return channelsToJoin;
}

void Login::joinChannels(QListWidget *channels)
{
    QList<QString>* channelsToJoin = convertChannelList(channels);
    for(int i = 0; i < channelsToJoin->size() ; i++)
    {
        QString chan = channelsToJoin->at(i);
        chan.append('\n');
        chan.prepend("JOIN ");
<<<<<<< HEAD
        socket->write(chan.toUtf8());
    }
}

/*
 * Preset functions
 */

void Login::loadPreset(QString preset)
{
    QFile config("config.cfg");
    if (config.exists()) {
        config.open(QIODevice::ReadOnly);
        QString buf;
        while(!config.atEnd() && buf.compare('<' + preset + ">\n"))
        {
            buf = config.readLine();
        }
        //username
        buf = config.readLine();
        buf=buf.split(" = ").at(1);
        if (buf.length() > 0)
            ui->lineEdit_username->setText(buf.left(buf.length() - 1));
        //password
        buf = config.readLine();
        buf=buf.split(" = ").at(1);
        if (buf.length() > 0)
            ui->lineEdit_pass->setText(buf.left(buf.length() - 1));
        //host
        buf = config.readLine();
        buf=buf.split(" = ").at(1);
        if (buf.length() > 0)
            ui->lineEdit_host->setText(buf.left(buf.length() - 1));
        //port
        buf = config.readLine();
        buf=buf.split(" = ").at(1);
        if (buf.length() > 0)
            ui->lineEdit_port->setText(buf.left(buf.length() - 1));
        //channel list
        buf = config.readLine();
        buf=buf.split(" = ").at(1);
        if (buf.length() > 0){
            QStringList channels = buf.split(' ');
            for(QString i : channels){
                if(i.contains('\n'))
                    i = i.left(i.length() - 1);
                ui->channelList->addItem(i);
            }
        }
        config.close();
    }
}

void Login::loadPresetList()
{
    ui->presetList->clear();
    QFile config("config.cfg");
    if (config.exists()) {
        config.open(QIODevice::ReadOnly);
        QString buf;
        while(!config.atEnd() && !buf.startsWith('<'))
        {
            buf = config.readLine();
            if(buf.startsWith('<')){
               buf.remove(0, 1);
               buf.remove(buf.length() - 2, 2);
               ui->presetList->addItem(buf);
            }
        }
        config.close();
    }
}

void Login::on_pushButton_newPreset_clicked()
{
    ui->presetList->addItem(ui->lineEdit_username->text() + " - " + ui->lineEdit_host->text() + ':' + ui->lineEdit_port->text());
    QFile config("config.cfg");
    if (config.exists()) {
        config.open(QIODevice::WriteOnly | QIODevice::Append);
        QTextStream flux(&config);
        flux.setCodec("UTF-8");
        flux << '<' << ui->lineEdit_username->text() << " - " << ui->lineEdit_host->text() << ':' << ui->lineEdit_port->text() << '>' << endl;
        flux << "Username = " << ui->lineEdit_username->text() << endl;
        flux << "Password = " << ui->lineEdit_pass->text() << endl;
        flux << "Host = " << ui->lineEdit_host->text() << endl;
        flux << "Port = " << ui->lineEdit_port->text() << endl;
        flux << "Channels = ";
        for(int i = 0; i < ui->channelList->count(); i++)
            flux << ui->channelList->item(i)->text() << ' ';
        flux << endl;
        config.close();
    }
    ui->presetList->setCurrentIndex(ui->presetList->count() - 1);
}

void Login::on_presetList_activated(const QString &arg1)
{
    ui->channelList->clear();
    loadPreset(arg1);
}

void Login::on_pushButton_savePreset_clicked()
{
    QString current = ui->presetList->currentText();
    current.prepend('<');
    QString res;
    QFile config("config.cfg");
    if (config.exists()) {
        config.open(QIODevice::ReadWrite);
        QTextStream out(&config);
        QString line = out.readLine();
        while(!line.startsWith(current) && !out.atEnd()){
            res.append(line + '\n');
            line = out.readLine();
        }
        for(int i = 0; i < 5; i++)
            QString line = out.readLine();
        res.append('<'+ui->lineEdit_username->text() + " - " + ui->lineEdit_host->text() + ':' + ui->lineEdit_port->text() + ">\n");
        res.append("Username = " + ui->lineEdit_username->text() + '\n');
        res.append("Password = " + ui->lineEdit_pass->text() + '\n');
        res.append("Host = " + ui->lineEdit_host->text() + '\n');
        res.append("Port = " + ui->lineEdit_port->text() + '\n');
        res.append("Channels =");
        for(int i = 0; i < ui->channelList->count(); i++) {
            QString tmp = ' ' + ui->channelList->item(i)->text();
            res.append(tmp);
        }
        res.append('\n');
        while(!out.atEnd()){
            line = out.readLine();
            res.append(line + '\n');
        }
        config.resize(0);
        out << res;
        config.close();
        loadPresetList();
    }
}

void Login::on_pushButton_deletePreset_clicked()
{
    QString current = ui->presetList->currentText();
    current.prepend('<');
    QString res;
    QFile config("config.cfg");
    if (config.exists()) {
        config.open(QIODevice::ReadWrite);
        QTextStream out(&config);
        while(!out.atEnd()){
            QString line = out.readLine();
            while(!line.startsWith(current) && !out.atEnd()){
                res.append(line + '\n');
                line = out.readLine();
            }
            for(int i = 0; i < 5; i++){
                QString line = out.readLine();
            }
        }
        config.resize(0);
        out << res;
        config.close();
        ui->presetList->removeItem(ui->presetList->currentIndex());
        ui->presetList->setCurrentIndex(0);
=======
        socket->write(chan.toLatin1().data());
>>>>>>> origin/ClientLourd
    }
}
