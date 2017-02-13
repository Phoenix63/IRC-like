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
    parseur.setSocket(socket);
    msgList.setMsgSender(ui->messageSender);
    ui->messageSender->installEventFilter(this);
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
    msgList.addMsg(message);
    message.append('\n');
    if(!parseur.out(&message))
        this->close();
    msgList.scrollReset();
    socket->write(message.toLatin1().data());
    ui->messageSender->setText("");
}

void MainFrame::on_channelList_itemSelectionChanged()
{
    channel.change(ui->channelList->currentItem()->text());
}


bool MainFrame::eventFilter(QObject *obj, QEvent *event)
{
    if (obj == ui->messageSender) {
        if (event->type() == QEvent::KeyPress) {
            QKeyEvent* keyEvent = static_cast<QKeyEvent*>(event);
            if (keyEvent->key() == Qt::Key_Up) {
                msgList.scrollUp();
                return true;
            } else if (keyEvent->key() == Qt::Key_Down) {
                msgList.scrollDown();
                return true;
            } else if (keyEvent->key() == Qt::Key_Escape) {
                msgList.scrollReset();
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        // pass the event on to the parent class
        return QDialog::eventFilter(obj, event);
    }
}
