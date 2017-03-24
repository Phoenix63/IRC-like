#ifndef GUI_UPLOADFILE_H
#define GUI_UPLOADFILE_H

#include <QString>
#include <QStringList>
#include <QTcpSocket>
#include <QThread>

class Upload : public QThread
{
    Q_OBJECT

public:
    Upload(QWidget *parent, QString host, QStringList files, QTcpSocket *sock);
    void run() Q_DECL_OVERRIDE;
signals:
    void resultReady(QString result);
    void noHost();
private:
    QString host;
    QStringList files;
    QTcpSocket *socket;
};

#endif // GUI_UPLOADFILE_H
