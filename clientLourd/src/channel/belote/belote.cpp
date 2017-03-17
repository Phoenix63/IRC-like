#include "belote.h"
#include "ui_belote.h"

#include <QLabel>
#include <QMessageBox>

Belote::Belote(QWidget *parent, QTcpSocket *sock, QString chan, QString nick) :
    QMainWindow(parent),
    ui(new Ui::Belote),
    socket(sock),
    channelName(chan),
    username(nick)
{
    ui->setupUi(this);
    this->show();
    this->setWindowTitle(nick + " - " + "Belote room : " + chan);
    this->centralWidget()->setStyleSheet("border-image: url(\"ressources/img/tapis.jpg\") 0 0 0 0 stretch stretch;");
    lobbyWait();
}

Belote::~Belote()
{
    delete ui;
}

/*
 * User interface functions
 */

void Belote::clean()
{
    clearLayout(ui->southCards);
    clearLayout(ui->northCards);
    clearLayout(ui->East);
    clearLayout(ui->West);
}

void Belote::clearLayout(QLayout *layout)
{
    QLayoutItem *item;
    while((item = layout->takeAt(0))) {
        if (item->layout()) {
            clearLayout(item->layout());
            delete item->layout();
        }
        if (item->widget()) {
            delete item->widget();
        }
        delete item;
    }
}

BELOTE::CARD Belote::findCard()
{
    for(auto i:hand.keys()){
        if (hand[i]->isDown()) {
            return i;
        }
    }
}

void Belote::chooseTrump(BELOTE::CARD card)
{
    clearLayout(ui->buttons);
    int trump = card / 8;
    //TODO find proper way to implement
}

void Belote::displayCard(BELOTE::CARD card)
{
    unsigned int trump = card / 8;
    unsigned int value = card % 8;
    QPixmap cards("ressources/img/cards.jpg");
    QRect rect(73*value, 97*trump, 73, 97);
    QPixmap cropped = cards.copy(rect);
    cropped.scaledToHeight(70,Qt::SmoothTransformation);
    QLabel *lCard = new QLabel;
    lCard->setPixmap(cropped);
    ui->board->addWidget(lCard);
}

/*
 *
 */
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
    cropped.scaledToHeight(70,Qt::SmoothTransformation);
    QPushButton *newCard = new QPushButton();
    newCard->setIcon(cropped);
    newCard->setStyleSheet("border-image : none; \
                            background-color: rgba( 255, 255, 255, 0% );");
    newCard->setIconSize(QSize(70,90));
    ui->southCards->addWidget(newCard);
    hand[card] = newCard;
    connect(newCard , &QPushButton::pressed, this, &Belote::findCard);
}

void Belote::emptyHand()
{
    clean();
    for(auto i:hand.keys()) {
        hand.remove(i);
    }
}

void Belote::chooseTeam()
{
    QMessageBox teamSelec;
    teamSelec.setText("Which team do you want to join ?");
    QPushButton *blueTeam = teamSelec.addButton(tr("Blue"), QMessageBox::NoRole);
    QPushButton *redTeam = teamSelec.addButton(tr("Red"), QMessageBox::NoRole);
    teamSelec.exec();
    if (teamSelec.clickedButton() == blueTeam) {
        QString message = "BELOTE READY " + channelName + " 0\n";
        socket->write(message.toUtf8());
    } else if (teamSelec.clickedButton() == redTeam){
        QString message = "BELOTE READY " + channelName + " 1\n";
        socket->write(message.toUtf8());
    }
    teamSelec.close();
}

void Belote::parse(QString string)
{
    qDebug() << "belote :" << string;
    if (!in_isPartNote(string))
    if (!in_isTeamSelec(string))
    if (!in_isFullTeam(string))
    if (!in_isGameReset(string))
    if (!in_isTrumpChoice(string))
    if (!in_isCardDeal(string))
        qDebug() << "cant find this";
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

bool Belote::in_isTrumpChoice(QString string)
{
    if (!string.startsWith("donald"))
        return false;
    BELOTE::CARD card =(BELOTE::CARD)string.split(' ').last().toInt();
    displayCard(card);
    chooseTrump(card);
    return true;
}

bool Belote::in_isPartNote(QString string)
{
    if (!string.contains("leave team"))
        return false;
    emptyHand();
    lobbyWait();
    return true;
}

bool Belote::in_isGameReset(QString string)
{
    if (!string.startsWith("game reset"))
        return false;
    emptyHand();
    lobbyWait();
    return true;
}

bool Belote::in_isTeamSelec(QString string)
{
    if (!string.startsWith("team selection"))
        return false;
    chooseTeam();
    return true;
}

bool Belote::in_isFullTeam(QString string)
{
    if (!string.contains("team is full"))
        return false;
    QMessageBox::information(this, "Error", "Team is full");
    chooseTeam();
    return true;
}
