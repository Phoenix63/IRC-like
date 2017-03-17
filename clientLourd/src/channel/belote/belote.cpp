#include "belote.h"
#include "ui_belote.h"

#include <QLabel>
#include <QMessageBox>
#include "rpl_response.h"

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
    this->setObjectName("Belote");
    this->setStyleSheet("QMainWindow#Belote {" \
                        "border-image: url(\"ressources/img/tapis.jpg\") 0 0 0 0 stretch stretch;"
                        "}"
                        );
    lobbyWait();
}

Belote::~Belote()
{
    delete ui;
}

int Belote::position()
{
    return aPosition;
}

void Belote::position(int val)
{
    aPosition = val;
}

/*
 * User interface functions
 */

void Belote::clean()
{
    clearLayout(ui->southCards);
    clearLayout(ui->north);
    clearLayout(ui->east);
    clearLayout(ui->west);
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

void Belote::playCard()
{
    for(auto i:hand.keys()){
        if (hand[i]->isDown()) {
            Card * toPlay = i;
            displayCard(toPlay);
            hand.remove(toPlay);
            QString message = "BELOTE PLAY " + channelName + " " + toPlay->code() + '\n';
            socket->write(message.toUtf8());
        }
    }
}

void Belote::setInactive()
{
    for (auto i:hand.keys()) {
        hand[i]->setDisabled(true);
    }
}

void Belote::setActive(QString string)
{
    QStringList cards = string.split(',');
    QList<int> iCards;
    for(auto i:cards) {
        iCards.push_back(i.toInt());
    }
    for (auto i:hand.keys()) {
        if (iCards.contains(i->code()))
            hand[i]->setEnabled(true);
    }
}

void Belote::chooseTrump(Card *card)
{
    clearLayout(ui->buttons);
    int trump = card->suit();
    //TODO find proper way to implement
}

void Belote::displayCard(Card *card)
{
    qDebug() << card->rank() << card->suit() << card->value();
    QPixmap cards("ressources/img/cards.jpg");
    QRect rect(73*card->rank(), 97*card->suit(), 73, 97);
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
    QLabel *wait = new QLabel("Waiting for other players...");
    ui->buttons->addWidget(wait);
    wait->setStyleSheet("border-image : none;");
}

void Belote::receiveCard(int val)
{
    Card *card = new Card(val);
    qDebug() << val << card->rank() << card->suit() << card->value();
    QPixmap cards("ressources/img/cards.jpg");
    QRect rect(73*card->rank(), 97*card->suit(), 73, 97);
    QPixmap cropped = cards.copy(rect);
    cropped.scaledToHeight(70,Qt::SmoothTransformation);
    QPushButton *newCard = new QPushButton();
    newCard->setIcon(cropped);
    newCard->setStyleSheet("border-image : none; \
                            background-color: rgba( 255, 255, 255, 0% );");
    newCard->setIconSize(QSize(70, 90));
    ui->southCards->addWidget(newCard);
    hand[card] = newCard;
    connect(newCard , &QPushButton::pressed, this, &Belote::playCard);
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
    clearLayout(ui->buttons);
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

void Belote::firstRound(int trump)
{
    setInactive();
    CustomLayout *tmp = new CustomLayout();
    tmp->setLayout(ui->buttons);
    tmp->addButton("Take", trump);
    tmp->addButton("No", -1);
    connect(tmp, &CustomLayout::isClicked, this, &Belote::take);
}

void Belote::take(int trump, CustomLayout *layout)
{
    socket->write("BELOTE TAKE " + trump + '\n');
    clearLayout(ui->buttons);
    delete layout;
}

void Belote::secondRound(int trump)
{
    CustomLayout *tmp = new CustomLayout();
    tmp->setLayout(ui->buttons);
    if (trump != 0)
        tmp->addButton("Spades", 0);
    if (trump != 1)
        tmp->addButton("Hearths", 1);
    if (trump != 2)
        tmp->addButton("Clubs", 2);
    if (trump != 3)
    tmp->addButton("Diamonds", 3);
    tmp->addButton("No", -1);
    connect(tmp, &CustomLayout::isClicked, this, &Belote::take);
}

void Belote::parse(QString string)
{
    qDebug() << "belote :" << string;
    if (!in_isTeamSelec(string))
    if (!in_isGameStart(string))
    if (!in_isFullTeam(string))
    if (!in_isGameReset(string))
    if (!in_isTrumpChoice(string))
    if (!in_isTakeTurn(string))
    if (!in_isPlayerPlay(string))
    if (!in_isCardDeal(string))
        qDebug() << "cant find this";
}

bool Belote::in_isCardDeal(QString string)
{
    if (!string.contains(BELOTE::RPL::RECEIVED))
        return false;
    QStringList cardList = string.split(' ').last().split(',');
    qDebug() << cardList;
    for (auto i:cardList) {
        receiveCard(i.toInt());
    }
    return true;
}

bool Belote::in_isTrumpChoice(QString string)
{
    if (!string.contains(BELOTE::RPL::TRUMPIS))
        return false;
    int iCard = string.split(' ').last().toInt();
    Card *card = new Card(iCard);
    displayCard(card);
    chooseTrump(card);
    return true;
}

bool Belote::in_isPlayerPlay(QString string)
{
    if (!string.contains(BELOTE::RPL::PLAYED))
        return false;
    int card = string.split(' ').last().toInt();
    displayCard(new Card(card));
    return true;
}

bool Belote::in_isTakeTurn(QString string)
{
    if (!string.contains(BELOTE::RPL::TURNTOTAKE))
        return false;
    QString turn = string.split(' ').last();
    QString strump = string.split(' ').at(3);
    int trump = strump.remove(0, 1).toInt();
    turn == "(0)" ? firstRound(trump) : secondRound(trump);
    return true;
}

bool Belote::in_isGameReset(QString string)
{
    if (!string.contains(BELOTE::RPL::GAMERESET))
        return false;
    emptyHand();
    lobbyWait();
    return true;
}

bool Belote::in_isTeamSelec(QString string)
{
    if (!string.contains(BELOTE::RPL::TEAMSELEC))
        return false;
    chooseTeam();
    return true;
}

bool Belote::in_isGameStart(QString string)
{
    if (!string.contains(BELOTE::RPL::ROUNDSTART))
        return false;
    QString players = string.split(' ').last();
    QStringList playerList = players.split(',');
    position(playerList.indexOf(username));
    QString eastPlayer = playerList.at((position() + 1) % 4);
    QString northPlayer = playerList.at((position() + 2) % 4);
    QString westPlayer = playerList.at((position() + 3) % 4);
    qDebug() << eastPlayer << northPlayer;
    QLabel *east = new QLabel(eastPlayer);
    ui->east->addWidget(east);
    QLabel *north = new QLabel(northPlayer);
    ui->north->addWidget(north);
    QLabel *west = new QLabel(westPlayer);
    ui->west->addWidget(west);
    return true;
}

bool Belote::in_isYourTurn(QString string)
{
    if (!string.contains(BELOTE::RPL::YOURTURN))
        return false;
    clearLayout(ui->buttons);
    QLabel *wait = new QLabel("Your turn to play");
    ui->buttons->addWidget(wait);
    wait->setStyleSheet("border-image : none;");
    QString cardList = string.split(' ').last();
    setActive(cardList);
    while(1) {
        playCard();
    }
    return true;
}

bool Belote::in_isFullTeam(QString string)
{
    if (!string.contains(BELOTE::ERR::FULLTEAM))
        return false;
    QMessageBox::information(this, "Error", "Team is full");
    chooseTeam();
    return true;
}
