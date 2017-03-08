#include "uploadfile.h"

#include <QFileDialog>
#include <QMessageBox>
#include <QRegularExpression>
#include <QStandardPaths>
#include <QString>
#include <QTcpSocket>

#include <QDebug>

Upload::Upload(QWidget *parent, QString host, QStringList files, QTcpSocket *sock):
    QThread(parent),
    host(host),
    files(files),
	socket(sock)
{

}

void Upload::run()
{
    for (auto i:files){
        QByteArray read;
        QFile inputFile(i);
        int size = inputFile.size();
        QString fileName = i.split('/').last();
        QString toSend = "FILE " + QString::number(size, 10) + " " + fileName + '\n';
        socket->write(toSend.toLatin1());
        socket->waitForReadyRead(1000);
        inputFile.open(QIODevice::ReadOnly);
        read = inputFile.read(100);
        while (read.size() > 0)
        {
            socket->write(read);
            socket->waitForBytesWritten();
            read.clear();
            read = inputFile.read(100);
        }
        inputFile.close();
        socket->waitForReadyRead(-1);
        QString url = socket->readLine();
        url.remove(0, 1);
        int j = url.indexOf(QRegularExpression(":.+$"));
        url = url.right(url.length() - j - 1);
        emit resultReady(url);
    }
}
