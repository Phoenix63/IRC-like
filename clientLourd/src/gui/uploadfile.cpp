#include "uploadfile.h"

#include <QFileDialog>
#include <QMessageBox>
#include <QRegularExpression>
#include <QStandardPaths>
#include <QString>
#include <QTcpSocket>


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
        inputFile.open(QIODevice::ReadOnly);
        read = inputFile.read(100);
        while (read.size() > 0)
        {
            socket->write(read);
            read.clear();
            read = inputFile.read(100);
        }
        inputFile.close();
    }
}
