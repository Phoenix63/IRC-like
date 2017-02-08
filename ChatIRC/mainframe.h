#ifndef MAINFRAME_H
#define MAINFRAME_H

#include <QTcpSocket>
#include <QAbstractSocket>
#include <QDialog>
#include "channel.h"

namespace Ui {
class MainFrame;
}

class MainFrame : public QDialog
{
    Q_OBJECT

public:
    explicit MainFrame(QWidget *parent = 0,QTcpSocket *socket=NULL);
    ~MainFrame();

public slots:
    void readyRead();

private slots:
    void on_pushButton_send_clicked();

private:
    Ui::MainFrame *ui;
    QTcpSocket *socket;
    Channel channel;
};

#endif // MAINFRAME_H
