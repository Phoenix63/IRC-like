#include "mainframe.h"
#include "ui_mainframe.h"
#include <QTcpSocket>
#include <QAbstractSocket>


MainFrame::MainFrame(QWidget *parent,QTcpSocket *socket) :
    QDialog(parent),
    ui(new Ui::MainFrame)
{
    ui->setupUi(this);
}

MainFrame::~MainFrame()
{
    delete ui;
    delete socket;
}

void MainFrame::on_pushButton_send_clicked()
{
    QString message = ui->lineEdit_message->text();
    const char* c = message.toStdString().c_str();
    qDebug() << message << "avant transfo";
    qDebug() << c;
    socket->write(c);
}
