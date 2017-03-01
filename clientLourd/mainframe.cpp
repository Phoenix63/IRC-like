#include "mainframe.h"
#include "ui_mainframe.h"
#include "channellist.h"

#include <QTcpSocket>
#include <QScrollBar>
#include <QStandardPaths>
#include <QFileDialog>
#include <QDebug>
/*
 * Mainframe: constructor and destructor
 */

MainFrame::MainFrame(QWidget *parent,QTcpSocket *socket) :
    QMainWindow(parent),
    ui(new Ui::MainFrame),
    socket(socket)
{
    ui->setupUi(this);
    connect(socket, SIGNAL(readyRead()),this, SLOT(readyRead()));
<<<<<<< HEAD
    channel.setUi(ui->channelList, ui->chatBox,ui->userList,ui->topicDisplay,ui->messageSender, ui->nickBox);
    chanList = new Channellist(this);
    parser.initialize(&channel, socket, &nick, chanList);
    msgList.setMsgSender(ui->messageSender);
    ui->messageSender->installEventFilter(this);
    ui->scrollArea->setStyleSheet("background-color: white");
    connect(ui->scrollArea->verticalScrollBar(), SIGNAL(rangeChanged(int, int)), this, SLOT(moveScrollBarToBottom(int, int)));
    ui->pushButton_emojis->setIcon(QPixmap("img/smile.png"));
    ui->pushButton_upload->setIcon(QPixmap("img/upload.png"));
    ui->pushButton_emojis->setContextMenuPolicy(Qt::CustomContextMenu);
    emoji = channel.getHashMap();
=======
    channel.setUi(ui->channelList, ui->chatBox,ui->userList,ui->topicDisplay);
    parseur.setChannel(&channel);
    parseur.setSocket(socket);
    msgList.setMsgSender(ui->messageSender);
    ui->messageSender->installEventFilter(this);
    ui->scrollArea->setStyleSheet("background-color: white");
    connect(ui->scrollArea->verticalScrollBar(), SIGNAL(rangeChanged(int,int)), this, SLOT(moveScrollBarToBottom(int, int)));
>>>>>>> origin/ClientLourd
}

MainFrame::~MainFrame()
{
    delete ui;
    delete socket;
}

<<<<<<< HEAD

void MainFrame::setNickname(QString nick)
{
    nickname = nick;
    parser.setNickname(&nickname);
}

=======
>>>>>>> origin/ClientLourd
/*
 * MainFrame: socket slots
 */

void MainFrame::readyRead()
{
    while(socket->canReadLine()){
        QString string = QString(socket->readLine());
        parser.in(string);
    }
}

void MainFrame::closeEvent (QCloseEvent *event)
{
    emit showLogin();
    if(parser.out("/quit"))
    {
        event->accept();
    }
}

/*
 * mainFrame: UI slots
 */

void MainFrame::on_pushButton_send_clicked()
{
<<<<<<< HEAD
    QMenu contextMenu(tr("Context menu"), this);
    QList<QAction* > listAction;
    QStringList emojis = emoji->keys();
    emojis.sort(Qt::CaseInsensitive);
    for (auto i : emojis)
    {
        listAction.append(new QAction(i, this));
        listAction.last()->setIcon(QPixmap(emoji->value(i)));
    }
    contextMenu.addActions(listAction);
    contextMenu.setMinimumSize(50, 80);
    QAction * action = contextMenu.exec(ui->MessageBox->mapToGlobal(QPoint(600, 500)));
    QString emotes;
    if (action)
        emotes = action->text();
    ui->messageSender->setText(ui->messageSender->text() + emotes);
=======
    QString message = ui->messageSender->text();
    //ui->messagePrinter->append(message);
    msgList.addMsg(message);
    if(!parseur.out(message))
        this->close();
    msgList.scrollReset();
    //socket->write(message.toLatin1().data());
    ui->messageSender->setText("");
>>>>>>> origin/ClientLourd
}

void MainFrame::moveScrollBarToBottom(int min, int max)
{
    Q_UNUSED(min);
    ui->scrollArea->verticalScrollBar()->setValue(max);
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
<<<<<<< HEAD
    QString message = ui->messageSender->text();
    msgList.addMsg(message);
    if(!parser.out(message))
        this->close();
    msgList.scrollReset();
    ui->messageSender->setText("");
    ui->messageSender->setPlaceholderText("Message "+channel.channelName());
}

void MainFrame::on_pushButton_send_customContextMenuRequested(const QPoint &pos)
{
	QMenu contextMenu(tr("Context menu"), this);
    QAction action1("Remove Data Point", this);
    contextMenu.addAction(&action1);
    contextMenu.exec(ui->pushButton_emojis->mapToGlobal(pos));
}

void MainFrame::on_pushButton_upload_clicked()
{
    QStringList homePath = QStandardPaths::standardLocations(QStandardPaths::HomeLocation);
    QStringList files = QFileDialog::getOpenFileNames(this,"Select one or more files to open", homePath.first());
}

void MainFrame::on_actionConnect_triggered()
{
    emit showLogin();
}
=======
    on_pushButton_send_clicked();
}

>>>>>>> origin/ClientLourd
