#include "belote.h"
#include "ui_belote.h"

#include <QMessageBox>

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

Belote::~Belote()
{
    delete ui;
}

BELOTE::CARD Belote::findCard()
{
    for(auto i:hand.keys()){
        if (hand[i]->isDown())
            return i;
    }
}

void Belote::lobbyWait()
{
    QMessageBox waiting;
    waiting.setText("Waiting for other players...");
    waiting.exec();
}

void Belote::receiveCard(BELOTE::CARD card)
{
    unsigned int trump = card / 8;
    unsigned int value = card % 8;
    QPixmap cards("ressources/img/cards.jpg");
    QRect rect(73*value, 97*trump, 73, 97);
    QPixmap cropped = cards.copy(rect);
    QPushButton *newCard = new QPushButton();
    newCard->setIcon(cropped);
    ui->southCards->addWidget(newCard);
    hand[card] = newCard;
    connect(newCard , &QPushButton::clicked, this, &Belote::findCard);
}

void Belote::parse(QString string)
{
    qDebug() << "belote :" << string;
    if (!in_isTeamSelec(string))
    if (!in_isCardDeal(string))
        qDebug() << "toto";
}


bool Belote::in_isTeamSelec(QString string)
{
    if (!string.startsWith("team selection"))
        return false;
    QMessageBox teamSelec;
    teamSelec.setText("Which team do you want to join ?");
    QPushButton *blueTeam = teamSelec.addButton(tr("Blue"), QMessageBox::NoRole);
    QPushButton *redTeam = teamSelec.addButton(tr("Red"), QMessageBox::NoRole);
    teamSelec.exec();
    if (teamSelec.clickedButton() == blueTeam) {
        socket->write("BELOTE READY 0\n");
    } else if (teamSelec.clickedButton() == redTeam){
        socket->write("BELOTE READY 1\n");
    }
    teamSelec.close();
    return true;
}

bool Belote::in_isCardDeal(QString string)
{
    if (!string.startsWith("you receive"))
        return false;
    QStringList cardList = string.split(' ').at(3).split(',');
    for (auto i:cardList) {
        receiveCard((BELOTE::CARD)i.toInt());
    }
    return true;
}
