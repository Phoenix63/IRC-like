#ifndef MAINFRAME_H
#define MAINFRAME_H

#include <QTcpSocket>
#include <QAbstractSocket>
#include <QDialog>
#include <QString>
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
    void test();

    void on_channelList_itemSelectionChanged();

private:
    Ui::MainFrame *ui;
    QTcpSocket *socket;
    Channel channel;
    Parseur::Out parseur_out;
    Parseur::In parseur_in;
    QString channelName;
};

#endif // MAINFRAME_H
