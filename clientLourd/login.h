#ifndef LOGIN_H
#define LOGIN_H


#include <QDialog>
#include <QObject>
#include <QTcpSocket>
<<<<<<< HEAD

class MainFrame;
class QListWidgetItem;
class QFile;
class QListWidget;
=======
#include <QAbstractSocket>
#include "mainframe.h"
>>>>>>> origin/ClientLourd

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
<<<<<<< HEAD

    //Preset functions
    void loadPreset(QString preset);
    void loadPresetList();
=======
    ~Login();

>>>>>>> origin/ClientLourd

private slots:
    //Connection buttons
    void on_pushButton_connect_clicked();
    void on_pushButton_guest_clicked();
    void displayLogin();

    //Channels to join
    void on_pushButton_addChannel_clicked();
    void on_channelList_itemClicked(QListWidgetItem *item);
    void on_pushButton_deleteChannel_clicked();

<<<<<<< HEAD
    //Preset functions
    void on_pushButton_newPreset_clicked();
    void on_pushButton_savePreset_clicked();
    void on_pushButton_deletePreset_clicked();
    void on_presetList_activated(const QString &arg1);

=======
>>>>>>> origin/ClientLourd
private:
    MainFrame *main;
    QTcpSocket *socket;
    Ui::Login *ui;
    QList<QString>* channelsToJoin;
};

#endif // LOGIN_H
