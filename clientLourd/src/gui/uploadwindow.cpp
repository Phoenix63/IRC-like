#include "uploadwindow.h"
#include "ui_uploadwindow.h"

#include <QLabel>
#include <QMessageBox>

UploadWindow::UploadWindow(QWidget *parent, QTcpSocket *sock) :
    QDialog(parent),
    ui(new Ui::UploadWindow),
    socket(sock)
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
    string.remove(0, 1);
    int j = string.indexOf(QRegularExpression(":.+$"));
    if (string.contains("TRANSFERT"))
    {
        QString progress = string.right(string.length() - j - 1);
        ui->progressBar->setMaximum(progress.split('/').at(1).toInt());
        ui->progressBar->setValue(progress.split('/').at(0).toInt());
    } else if (string.contains(" < size <")) {
        QMessageBox::information(this, "Error", "File is too large");
        this->close();
    }
    else {
        QString url = string.right(string.length() - j - 1);
        emit resultReady(url);
        this->close();
    }
}
