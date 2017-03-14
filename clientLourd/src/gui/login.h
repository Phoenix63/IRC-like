#ifndef GUI_LOGIN_H
#define GUI_LOGIN_H

#include <QDialog>

#include "../config/configlist.h"

class MainFrame;
class QListWidget;
class QListWidgetItem;
class QStringList;
class QTcpSocket;

class ThemeList;

namespace Ui {
class Login;
}

class Login : public QDialog
{
    Q_OBJECT

public:
    //Constructor and destructor
    explicit Login(QWidget *parent = 0);
    void initUIStyle();
    ~Login();
    void closeEvent (QCloseEvent *event);
    //Connection to server
    bool doConnect();
    void sendInfos();

    //Connection to channels
    void joinChannels(QListWidget *list);
    QStringList convertChannelList(QListWidget *list);

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
	void deleteMain(MainFrame *mainFrame);

private:
    Ui::Login *ui;
    MainFrame *main;
    QTcpSocket *socket;
    ConfigList config;
    ThemeList *theme;
};

#endif // LOGIN_H
