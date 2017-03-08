#ifndef GUI_UPLOADWINDOW_H
#define GUI_UPLOADWINDOW_H

#include <QDialog>
#include <QTcpSocket>

#include "../config/themelist.h"

namespace Ui {
class UploadWindow;
}

class UploadWindow : public QDialog
{
    Q_OBJECT

public:
    explicit UploadWindow(QWidget *parent = 0, QTcpSocket *sock = NULL);
    void initUIStyle();
    void parse(QString string);
    void readyRead();
    ~UploadWindow();
signals:
    void resultReady(QString result);
private:
    Ui::UploadWindow *ui;
	QTcpSocket *socket;
    ThemeList *theme;
};

#endif // UPLOADWINDOW_H
