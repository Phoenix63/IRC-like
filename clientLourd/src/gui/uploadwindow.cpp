#include "uploadwindow.h"
#include "ui_uploadwindow.h"

#include <QLabel>

UploadWindow::UploadWindow(QWidget *parent, QTcpSocket *sock) :
    QDialog(parent),
    socket(sock),
    ui(new Ui::UploadWindow)
{
    ui->setupUi(this);
	initUIStyle();
    connect(sock, &QTcpSocket::readyRead, this, &UploadWindow::readyRead);
}

UploadWindow::~UploadWindow()
{
    delete ui;
}

void UploadWindow::initUIStyle()
{
    theme = ThemeList::instance();
    this->setStyleSheet("background-color : " + theme->background() + ';' + " color : " + theme->text() + ';');
}

void UploadWindow::readyRead()
{
    while(socket->canReadLine()){
        QString string = QString(socket->readLine());
        parse(string);
    }
}

void UploadWindow::parse(QString string)
{
    if(string.startsWith("^FILE\\sTRANSFERT"))
    {
        QString progress = string.split(' ').at(2);
        ui->progressBar->setMaximum(progress.split('/').at(1).toInt());
        ui->progressBar->setValue(progress.split('/').at(0).toInt());
    } else {
        QLabel *result = new QLabel(string);
        ui->urlLayout->addWidget(result);
        emit resultReady(url);
    }
}
