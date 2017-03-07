#ifndef MAINFRAME_H
#define MAINFRAME_H

#include <QMainWindow>
#include <QCompleter>

#include "channel.h"
#include "parser.h"
#include "msglist.h"
#include "themelist.h"

class QPixmap;
class QTcpSocket;
class QScrollBar;
class QPoint;
class QStringList;
class QFileDialog;
class QStandardPaths;
class Channellist;
class Message;

template <typename>
class Qlist;
template <typename, typename>
class QHash;

namespace Ui {
class MainFrame;
}

class MainFrame : public QMainWindow
{
	Q_OBJECT

public:
	//Constructor and Destructor
    explicit MainFrame(QWidget *parent = 0, QTcpSocket *socket=NULL, QString host = "localhost");
	~MainFrame();

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

	//Socket slots
	void readyRead();
	void closeEvent (QCloseEvent *event);

	//UI slots
	void on_pushButton_emojis_clicked();
	void moveScrollBarToBottom(int min, int max);

signals:
	void showLogin();

private slots:
	void on_channelList_itemSelectionChanged();
	void on_messageSender_returnPressed();
	void on_pushButton_upload_clicked();

	//QMenus
	void on_actionConnect_triggered();
	void on_actionDisconnect_triggered();

	void on_actionDark_toggled(bool arg1);
	void on_actionLight_toggled(bool arg1);

    void on_userList_doubleClicked(const QModelIndex &index);

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
    QString host;

	//Parser and channel for message handling
	Parser parser;
	Channel channel;
	MsgList msgList;
    QCompleter *StringCompleter;
};

#endif // MAINFRAME_H
