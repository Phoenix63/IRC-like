#include "mainframe.h"
#include "ui_mainframe.h"


/*
 * Mainframe: constructor
 */

MainFrame::MainFrame(QWidget *parent,QTcpSocket *socket) :
    QMainWindow(parent),
    ui(new Ui::MainFrame),
    socket(socket)
{
    ui->setupUi(this);
    connect(socket, SIGNAL(readyRead()),this, SLOT(readyRead()));
    channel.setUi(ui->channelList, ui->chatBox,ui->userList,ui->topicDisplay);
    parseur.setChannel(&channel);
    parseur.setSocket(socket);
    msgList.setMsgSender(ui->messageSender);
    ui->messageSender->installEventFilter(this);
    ui->scrollArea->setStyleSheet("background-color: white");
    connect(ui->scrollArea->verticalScrollBar(), SIGNAL(rangeChanged(int,int)), this, SLOT(moveScrollBarToBottom(int, int)));
    ui->pushButton_send->setIcon(QPixmap("img/smile.png"));
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

void MainFrame::moveScrollBarToBottom(int min, int max)
{
    Q_UNUSED(min);
    ui->scrollArea->verticalScrollBar()->setValue(max);
}

/*
 * mainFrame: UI slots
 */

void MainFrame::closeEvent (QCloseEvent *event)
{
    if(parseur.out("/quit"))
        event->accept();
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
        return QMainWindow::eventFilter(obj, event);
    }
    return false;
}

void MainFrame::on_messageSender_returnPressed()
{
    QString message = ui->messageSender->text();
    msgList.addMsg(message);
    if(!parseur.out(message))
        this->close();
    msgList.scrollReset();
    ui->messageSender->setText("");
}

