#include "mainframe.h"
#include "ui_mainframe.h"
#include "channellist.h"

#include <QTcpSocket>
#include <QScrollBar>
#include <QStandardPaths>
#include <QFileDialog>
#include <QDebug>
#include <QMessageBox>
#include <QPushButton>
/*
 * Mainframe: constructor and destructor
 */

MainFrame::MainFrame(QWidget *parent,QTcpSocket *socket) :
    QMainWindow(parent),
    ui(new Ui::MainFrame),
    socket(socket)
{
    ui->setupUi(this);
    this->setStyleSheet("background-color : " + IRC::COLOR::LIGHT::BACKGROUND + " color : " + IRC::COLOR::LIGHT::TEXT);
    ui->actionDark->setCheckable(true);
    ui->actionLight->setCheckable(true);
    connect(socket, SIGNAL(readyRead()),this, SLOT(readyRead()));
    channel.setUi(ui->channelList, ui->chatBox,ui->userList,ui->topicDisplay,ui->messageSender, ui->nickBox);
    parser.initialize(&channel, socket, "Guest");
    msgList.setMsgSender(ui->messageSender);
    ui->messageSender->installEventFilter(this);
    connect(ui->scrollArea->verticalScrollBar(), SIGNAL(rangeChanged(int, int)), this, SLOT(moveScrollBarToBottom(int, int)));
    ui->pushButton_emojis->setIcon(QPixmap("img/smile.png"));
    ui->pushButton_upload->setIcon(QPixmap("img/upload.png"));
    ui->pushButton_emojis->setContextMenuPolicy(Qt::CustomContextMenu);
    ui->messageSender->setFocus();
    QStringList CompletionList;
    CompletionList << "/clean " << "/debug " << "/nick " << "/user " << "/join " << "/names "
                   << "/pass " << "/part " << "/list " << "/topic " << "/kick " << "/who "
                   << "/whois " << "/mode " << "/msg " << "/quit";
    StringCompleter = new QCompleter(CompletionList,this);
    StringCompleter->setCaseSensitivity(Qt::CaseInsensitive);
    ui->messageSender->setCompleter(StringCompleter);
    emoji = channel.getHashMap();
}

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
void MainFrame::on_pushButton_emojis_clicked()
{
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
    QAction * action = contextMenu.exec(ui->MessageBox->mapToGlobal(QCursor::pos()));
    QString emotes;
    if (action)
        emotes = action->text();
    ui->messageSender->setText(ui->messageSender->text() + emotes);
    ui->messageSender->setFocus();
}

void MainFrame::moveScrollBarToBottom(int min, int max)
{
    Q_UNUSED(min);
    ui->scrollArea->verticalScrollBar()->setValue(max);
}

void MainFrame::on_channelList_itemSelectionChanged()
{
    channel.change(ui->channelList->currentItem()->text());
    ui->messageSender->setFocus();
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

void MainFrame::on_actionDisconnect_triggered()
{
    QMessageBox::StandardButton reply;
    reply = QMessageBox::question(this, "Disconnect", "Are you sure ?", QMessageBox::Yes|QMessageBox::No);
    if (reply == QMessageBox::Yes) {
        this->close();
        emit showLogin();
    }
}



void MainFrame::on_actionDark_toggled(bool arg1)
{
    ui->actionLight->setChecked(!arg1);
    this->setStyleSheet("background-color : " + IRC::COLOR::DARK::BACKGROUND + "color : " + IRC::COLOR::DARK::TEXT);
}

void MainFrame::on_actionLight_toggled(bool arg1)
{
    ui->actionDark->setChecked(!arg1);
    this->setStyleSheet("background-color : " + IRC::COLOR::LIGHT::BACKGROUND + "color : " + IRC::COLOR::LIGHT::TEXT);
}
