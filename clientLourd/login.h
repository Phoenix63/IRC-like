#ifndef LOGIN_H
#define LOGIN_H


#include <QDialog>
#include <QObject>
#include <QTcpSocket>

class MainFrame;
class QListWidgetItem;
class QFile;
class QListWidget;
#include "configlist.h"

namespace Ui {
class Login;
}

class Login : public QDialog
{
    Q_OBJECT
    
public:
    //Constructor and destructor
    explicit Login(QWidget *parent = 0);
    ~Login();
    void closeEvent (QCloseEvent *event);
    //Connection to server
    bool doConnect();
    void sendInfos();

    //Connection to channels
    void joinChannels(QListWidget *list);
    QList<QString>* convertChannelList(QListWidget *list);

    //Preset functions
    void loadPreset();
    void loadPresetList();

private slots:
    //Connection buttons
    void on_pushButton_connect_clicked();
    void on_pushButton_guest_clicked();
    void displayLogin();

    //Channels to join
    void on_pushButton_addChannel_clicked();
    void on_channelList_itemClicked(QListWidgetItem *item);
    void on_pushButton_deleteChannel_clicked();

    //Preset functions
    void on_pushButton_newPreset_clicked();
    void on_pushButton_savePreset_clicked();
    void on_pushButton_deletePreset_clicked();
    void on_presetList_activated(const QString &arg1);

private:
    MainFrame *main;
    QTcpSocket *socket;
    Ui::Login *ui;
    QList<QString>* channelsToJoin;
    ConfigList config;
};

#endif // LOGIN_H
