#ifndef LOGIN_H
#define LOGIN_H

#include <QDialog>
#include <QObject>
#include <QTcpSocket>
#include <QAbstractSocket>
#include <QFile>
#include "mainframe.h"

namespace Ui {
class Login;
}

class Login : public QDialog
{
    Q_OBJECT
    
public:
    explicit Login(QWidget *parent = 0);

    //Connection to server
    bool doConnect();
    void sendInfos();

    //Connection to channels
    void joinChannels(QListWidget *list);
    QList<QString>* convertChannelList(QListWidget *list);
    void loadPreset(QString preset);
    void loadPresetList();
    ~Login();


private slots:
    void on_pushButton_connect_clicked();
    void on_pushButton_guest_clicked();

    //Channels to join at login
    void on_pushButton_addChannel_clicked();
    void on_channelList_itemClicked(QListWidgetItem *item);
    void on_pushButton_deleteChannel_clicked();


    void on_pushButton_createNew_clicked();
    void on_configList_activated(const QString &arg1);


    void on_pushButton_save_clicked();
    void on_pushButton_delete_clicked();

private:
    MainFrame *main;
    QTcpSocket *socket;
    Ui::Login *ui;
    QList<QString>* channelsToJoin;
};

#endif // LOGIN_H
