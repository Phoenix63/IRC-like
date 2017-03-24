#include "scoreboard.h"
#include "ui_scoreboard.h"

#include "../../config/themelist.h"

ScoreBoard::ScoreBoard(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::ScoreBoard)
{
    ui->setupUi(this);
    theme = ThemeList::instance();
    this->setStyleSheet("background-color : " + theme->background() + ';' + " color : " + theme->text() + ';');
    ui->scores->setHorizontalHeaderLabels(QString("Kotei;Jbzz;Taker;Trump").split(';'));
    ui->scores->setColumnWidth(2, 70);
    ui->scores->horizontalHeader()->setStyleSheet("QHeaderView::section{background-color : " + theme->background() +
                                                  "; color : " + theme->text() + ";}");
}

ScoreBoard::~ScoreBoard()
{
    delete ui;
}

void ScoreBoard::reset()
{
    ui->scores->clear();
}

void ScoreBoard::addRound(QString taker, int trump)
{
    ui->scores->insertRow(ui->scores->rowCount());
    QString suit = "Spades";
    if (trump == 1)
        suit = "Hearths";
    else if (trump == 2)
        suit = "Clubs";
    else if (trump == 3)
        suit = "Diamonds";
    ui->scores->setItem(ui->scores->rowCount() - 1, 2, new QTableWidgetItem(taker));
    ui->scores->setItem(ui->scores->rowCount() - 1, 3, new QTableWidgetItem(suit));
}

void ScoreBoard::addScore(QString scores)
{
    ui->scores->setItem(ui->scores->rowCount() - 1, 0, new QTableWidgetItem(scores.split(',').at(0)));
    ui->scores->setItem(ui->scores->rowCount() - 1, 1, new QTableWidgetItem(scores.split(',').at(1)));
}
