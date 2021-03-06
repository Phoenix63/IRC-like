#include "belote.h"
#include "ui_belote.h"

#include <QLabel>
#include <QMediaPlayer>
#include <QMessageBox>
#include <QTimer>

#include "rpl_response.h"

Belote::Belote(QWidget *parent, QTcpSocket *sock, QString chan, QString nick) :
    QMainWindow(parent),
    ui(new Ui::Belote),
    socket(sock),
    channelName(chan),
    username(nick)
{
    ui->setupUi(this);
    setUpInfos();
    this->show();
    this->setWindowTitle(nick + " - " + "Belote room : " + chan);
    this->setObjectName("Belote");
    this->setStyleSheet("QMainWindow#Belote {" \
                        "border-image: url(\"ressources/img/tapis.jpg\") 0 0 0 0 stretch stretch;"
                        "}"
                        );
    ui->scoreboard->setHorizontalHeaderLabels(QString("Kotei;Jbzz").split(';'));
    lobbyWait();
}

void Belote::setUpInfos()
{
    //Last fold dialog
    fold = new QDialog(this);
    QHBoxLayout *test = new QHBoxLayout();
    fold->setLayout(test);

    //Scoretable dialog
    score = new ScoreBoard(NULL);
    score->hide();
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

void Belote::clearLayout(QLayout *layout)
{
    QLayoutItem *item;
    while((item = layout->takeAt(0))) {
        if (item->layout()) {
            clearLayout(item->layout());
        }
        if (item->widget()) {
            delete item->widget();
        }
    }
}

void Belote::cleanCards()
{
    if (ui->board->count() == 4)
        clearLayout(ui->board);
}

void Belote::parse(QString string)
{
    if (!in_isTeamSelec(string))
    if (!in_isGameStart(string))
    if (!in_isFullTeam(string))
    if (!in_isGameReset(string))
    if (!in_isTrumpChoice(string))
    if (!in_isPlayerTake(string))
    if (!in_isTakeTurn(string))
    if (!in_isPlayerPlay(string))
    if (!in_isEndFold(string))
    if (!in_isCardDeal(string))
    if (!in_isTeamPoints(string))
    if (!in_isYourTurn(string))
    if (!in_isTeamWon(string))
        return;
}

void Belote::playCard()
{
    for(auto i:hand.keys()) {
        if (hand[i]->isDown()) {
            Card * toPlay = i;
            QString message = "BELOTE PLAY " + channelName + " " + QString::number(toPlay->code()) + '\n';
            socket->write(message.toUtf8());
            hand[i]->setIcon(QIcon());
            hand[i]->clearMask();
            for (int j = 0; j < ui->south->count(); j++) {
                if (ui->south->itemAt(j)->widget() == hand[i]) {
                    hand[i]->hide();
                    QLayoutItem *card = ui->south->takeAt(j);
                    delete card;
                    break;
                }
            }
            hand.remove(i);
        }
    }
    setInactive();
}

void Belote::setActivePlayer(int lastPlayer)
{
    ui->westName->setStyleSheet("color : black;");
    ui->northName->setStyleSheet("color : black;");
    ui->eastName->setStyleSheet("color : black;");
    if (lastPlayer == position())
        ui->westName->setStyleSheet("color : red;");
    else if (lastPlayer == (position() + 1) % 4)
        ui->northName->setStyleSheet("color : red;");
    else if (lastPlayer == (position() + 2) % 4)
        ui->eastName->setStyleSheet("color : red;");
}

void Belote::setInactive()
{
    for (auto i:hand.keys()) {
        hand[i]->setDisabled(true);
    }
}

void Belote::setActive(QString string)
{
    setInactive();
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

void Belote::displayCard(Card *card)
{
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
    QPixmap cards("ressources/img/cards.jpg");
    QRect rect(73*card->rank(), 97*card->suit(), 73, 97);
    QPixmap cropped = cards.copy(rect);
    cropped.scaledToHeight(70,Qt::SmoothTransformation);
    QPushButton *newCard = new QPushButton();
    newCard->setIcon(cropped);
    newCard->setStyleSheet("background-color: rgba( 255, 255, 255, 0%);");
    newCard->setIconSize(QSize(70, 90));
    ui->south->addWidget(newCard);
    hand[card] = newCard;
    connect(newCard , &QPushButton::pressed, this, &Belote::playCard);
}

void Belote::emptyHand()
{
    clearLayout(ui->south);
    for(auto i:hand.keys()) {
        hand.remove(i);
    }
}

void Belote::chooseTeam()
{
    ui->order->hide();
    clearLayout(ui->buttons);
    QMessageBox teamSelec;
    teamSelec.setText("Which team do you want to join ?");
    QPushButton *blueTeam = teamSelec.addButton(tr("Kotei"), QMessageBox::NoRole);
    QPushButton *redTeam = teamSelec.addButton(tr("Jbzz"), QMessageBox::NoRole);
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

bool Belote::in_isTrumpChoice(QString string)
{
    if (!string.contains(BELOTE::RPL::TRUMPIS))
        return false;
    int iCard = string.split(' ').last().toInt();
    Card *card = new Card(iCard);
    clearLayout(ui->board);
    displayCard(card);
    return true;
}

void Belote::firstRound(int trump)
{
    CustomLayout *tmp = new CustomLayout();
    tmp->setLayout(ui->buttons, this);
    tmp->addButton("Take", trump / 8);
    tmp->addButton("No", -1);
    connect(tmp, &CustomLayout::isClicked, this, &Belote::take);
}

void Belote::take(int trump, CustomLayout *layout)
{
    QString message = "BELOTE TAKE " + channelName + " " + QString::number(trump) + '\n';
    socket->write(message.toUtf8());
    delete layout;
}

void Belote::secondRound(int card)
{
    int trump = card / 8;
    CustomLayout *tmp = new CustomLayout();
    tmp->setLayout(ui->buttons, this);
    if (trump != 0)
        tmp->addButton("Spades", 0);
    if (trump != 1)
        tmp->addButton("Hearths", 1);
    if (trump != 2)
        tmp->addButton("Clubs", 2);
    if (trump != 3)
        tmp->addButton("Diamonds", 3);
    if (aPosition != 3)
        tmp->addButton("No", -1);
    connect(tmp, &CustomLayout::isClicked, this, &Belote::take);
}

bool Belote::in_isCardDeal(QString string)
{
    if (!string.contains(BELOTE::RPL::RECEIVED))
        return false;
    QStringList cardList = string.split(' ').last().split(',');
    for (auto i:cardList) {
        receiveCard(i.toInt());
    }
    setInactive();
    return true;
}

bool Belote::in_isPlayerTake(QString string)
{
    ui->order->setText("");
    if (!string.contains(BELOTE::RPL::PLAYERTAKE))
        return false;
    QString take = string.split(' ').at(4);
    int taker = take.toInt();
    int trump = string.split(' ').last().toInt();
    if (taker == position())
        ui->taker->setText("Taker :" + username + " - ");
    else if (taker == (position() + 1) % 4)
        ui->taker->setText("Taker :" + ui->westName->text() + " - ");
    else if (taker == (position() + 2) % 4)
        ui->taker->setText("Taker :" + ui->northName->text() + " - ");
    else
        ui->taker->setText("Taker :" + ui->eastName->text() + " - ");
    clearLayout(ui->board);
    if (trump == 0)
        ui->taker->setText(ui->taker->text() + "♠");
    else if (trump == 1)
        ui->taker->setText(ui->taker->text() + "♥");
    else if (trump == 2)
        ui->taker->setText(ui->taker->text() + "♣");
    else
        ui->taker->setText(ui->taker->text() + "♦");
    QString tmp = ui->taker->text().right(ui->taker->text().length() - 7);
    score->addRound(tmp, trump);
    return true;
}

bool Belote::in_isPlayerPlay(QString string)
{
    if (!string.contains(BELOTE::RPL::PLAYED))
        return false;
    setActivePlayer(string.split(' ').at(4).toInt());
    int card = string.split(' ').last().toInt();
    Card *played = new Card(card);
    if (ui->board->count() == 4)
        clearLayout(ui->board);
    displayCard(played);
    return true;
}

bool Belote::in_isEndFold(QString string)
{
    if (!string.contains(BELOTE::RPL::ENDFOLD))
        return false;
    QString cards = string.split(' ').last();
    QStringList cardList = cards.split(',');
    lastFold.clear();
    fold->close();
    for (auto i:cardList)
        lastFold.append(new Card(i.toInt()));
    QTimer *wait = new QTimer(this);
    wait->setSingleShot(true);
    connect(wait, &QTimer::timeout, this, &Belote::cleanCards);
    wait->start(3 * 1000);
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
    turnOrder = string.split(' ').last();
    ui->order->setText("Turn Order :" + turnOrder);
    ui->order->show();
    QStringList playerList = turnOrder.split(',');
    position(playerList.indexOf(username));
    QString eastPlayer = playerList.at((position() + 3) % 4);
    QString northPlayer = playerList.at((position() + 2) % 4);
    QString westPlayer = playerList.at((position() + 1) % 4);
    ui->eastName->setText(eastPlayer);
    ui->northName->setText(northPlayer);
    ui->westName->setText(westPlayer);
    return true;
}

bool Belote::in_isYourTurn(QString string)
{
    QMediaPlayer *player = new QMediaPlayer;
#ifdef WIN32
    player->setMedia(QUrl::fromLocalFile("ressources/belote.mp3"));
#elif __linux__
    player->setMedia(QUrl::fromLocalFile(QString(getenv("PWD"))+"/ressources/belote.mp3"));
#endif
    player->setVolume(30);
    player->play();
    if (!string.contains(BELOTE::RPL::YOURTURN))
        return false;
    clearLayout(ui->buttons);
    QString cardList = string.split(' ').last();
    setActive(cardList);
    return true;
}

bool Belote::in_isTeamPoints(QString string)
{
    if (!string.contains(BELOTE::RPL::TEAMPOINTS))
        return false;
    emptyHand();
    ui->order->hide();
    QString points = string.split(' ').last();
    score->addScore(points);
    ui->scoreboard->setItem(0, 0, new QTableWidgetItem(points.split(',').at(0)));
    ui->scoreboard->setItem(0, 1, new QTableWidgetItem(points.split(',').at(1)));
    return true;
}

bool Belote::in_isTeamWon(QString string)
{
    if (!string.contains(BELOTE::RPL::TEAMWIN))
        return false;
    emptyHand();
    score->reset();
    QString winner = (string.split(' ').at(4) == '0') ? "Kotei" : "Jbzz";
    QMessageBox::information(this, "End of game", "Team " + winner + " won !");
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

void Belote::on_actionLast_Fold_triggered()
{
    QLayout *tmp = fold->layout();
    clearLayout(tmp);
    QPixmap cards("ressources/img/cards.jpg");
    for (auto i:lastFold) {
        QRect rect(73*i->rank(), 97*i->suit(), 73, 97);
        QPixmap cropped = cards.copy(rect);
        cropped.scaledToHeight(70,Qt::SmoothTransformation);
        QLabel *lCard = new QLabel;
        lCard->setPixmap(cropped);
        tmp->addWidget(lCard);
    }
    fold->show();
}



void Belote::on_actionStats_triggered()
{
    score->show();
}

void Belote::closeEvent(QCloseEvent *event)
{
    QString part = "PART " + channelName + '\n';
    socket->write(part.toUtf8());
    event->accept();
}
