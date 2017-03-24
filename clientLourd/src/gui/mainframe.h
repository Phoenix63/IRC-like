#ifndef GUI_MAINFRAME_H
#define GUI_MAINFRAME_H
//TODO menus contextuels et aide
#include <QMainWindow>

#include "msglist.h"

#include "../channel/channel.h"
#include "../config/themelist.h"
#include "../parser/parser.h"

class QCompleter;
class QTcpSocket;

class Message;

template <typename>
class Qlist;

namespace Ui {
class MainFrame;
}

class MainFrame : public QMainWindow
{
	Q_OBJECT

public:
	//Constructor and Destructor
    explicit MainFrame(QWidget *parent = 0, QTcpSocket *socket=NULL, QString host = "localhost", int port = 8088);
	~MainFrame();

	void connectSocket();
	void printMsgLine(Message chatMsgLine);
	void PrintMsg(QList<Message> chatMsgList);
	void clearLayout(QLayout *layout);
	void clean();

protected:
	bool eventFilter(QObject *obj, QEvent *event);

public slots:
	// Parser related slots
	void channelModified();
	void userModified();
	void chatModified();
	void needClean();
	void changeChannel();
	void topicModified();
	void lineAdded();
    void refreshMentionList();
    void nickModified(QString nick);

	//Socket slots
	void readyRead();
	void closeEvent (QCloseEvent *event);

	//UI slots
	void on_pushButton_emojis_clicked();
	void moveScrollBarToBottom(int min, int max);
	void handleResults(QString url);

signals:
	void showLogin();
	void deleteMainFrame(MainFrame *mainFrame);

private slots:
	void on_channelList_itemSelectionChanged();
    void on_userList_doubleClicked(const QModelIndex &index);
	void on_messageSender_returnPressed();
	void on_pushButton_upload_clicked();

	//QMenus
    //PandIRC
	void on_actionConnect_triggered();
    void on_actionDisconnect_triggered();
    void on_actionchannelList_triggered();
    void on_actionSet_Away_toggled(bool arg1);
    //Channel
    void on_actionBip_on_messages_toggled(bool arg1);
    void on_actionHide_join_part_messages_toggled(bool arg1);
    void on_actionClean_triggered();
    void on_actionNames_triggered();
    void on_actionwho_triggered();
    void on_actionClose_triggered();
    //Settings
	void on_actionDark_toggled(bool arg1);
	void on_actionLight_toggled(bool arg1);

private:
	// Initialisation functions
	void initUiConf();
	void initUIStyle();
	void initConnect();
	void initCompletion();

private:
	ParserEmoji parserEmoji;
    ThemeList *theme;
	Ui::MainFrame *ui;

	//Tcp pointer from login
	QTcpSocket *socket;
    int port;
    QString host;

	//Parser and channel for message handling
	Parser parser;
	Channel channel;
	MsgList msgList;
    QCompleter *stringCompleter;
    QCompleter *emoteCompleter;
    Channellist *listOfChannels;
};

#endif // MAINFRAME_H
