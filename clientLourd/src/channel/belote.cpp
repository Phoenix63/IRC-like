#include "belote.h"
#include "ui_belote.h"

#include <QMessageBox>
#include <QPushButton>

Belote::Belote(QWidget *parent, QTcpSocket *sock) :
    QMainWindow(parent),
    ui(new Ui::Belote),
    socket(sock)
{
    ui->setupUi(this);
    this->show();
    this->centralWidget()->setStyleSheet("background-image : url(\"ressources/img/tapis.jpg\"); "
                                         "background-repeat : no-repeat;"
                                         "border-image: url(\"ressources/img/tapis.jpg\") 0 0 0 0 stretch stretch;");
    lobbyWait();
}

void Belote::lobbyWait()
{
    QMessageBox waiting;
    waiting.setText("Waiting for other players...");
    waiting.exec();
}

bool Belote::in_isTeamSelec(QString string)
{
    if (!string.startsWith("team\\sselection"))
        return false;
    QMessageBox teamSelec;
    teamSelec.setText("Which team do you want to join ?");
    QPushButton *blueTeam = teamSelec.addButton(tr("Blue"), QMessageBox::NoRole);
    QPushButton *redTeam = teamSelec.addButton(tr("Red"), QMessageBox::NoRole);
    teamSelec.exec();
    if (teamSelec.clickedButton() == blueTeam) {
        socket->write("BELOTE READY 0");
    } else if (teamSelec.clickedButton() == redTeam){
        socket->write("BELOTE READY 1");
    }
    teamSelec.close();
    return true;
}


void Belote::parse(QString string)
{
    qDebug() << "belote :" << string;
    string = string.left(string.length() - 1);
    if (!in_isTeamSelec(string))
        qDebug() << "toto";
}

Belote::~Belote()
{
    delete ui;
}
