#include "channellist.h"

#include <QString>
#include <QTableWidget>
#include <QTcpSocket>

#include "ui_channellist.h"
#include "../config/themelist.h"

/*
 * Constructor and destructor
 */

Channellist::Channellist(QWidget *parent, QTcpSocket *socket):
    QDialog(parent),
    ui(new Ui::Channellist),
    socket(socket)
{
    ui->setupUi(this);
    ui->tableWidget->setColumnCount(3);
    ui->tableWidget->verticalHeader()->setVisible(false);
    ui->tableWidget->setSelectionBehavior(QAbstractItemView::SelectRows);
}

void Channellist::initUIStyle()
{
    theme = ThemeList::instance();
    this->setStyleSheet("background-color : " + theme->background() + ';' + " color : " + theme->text() + ';');
    ui->tableWidget->horizontalHeader()->setStyleSheet("QHeaderView::section{background-color : " + theme->background() +
                                                  "; color : " + theme->text() + ";}"); ui->tableWidget->setColumnWidth(0, 50);
    ui->tableWidget->setColumnWidth(0, 100);
    ui->tableWidget->setColumnWidth(1, 50);
    ui->tableWidget->setColumnWidth(2, 250);
}

Channellist::~Channellist()
{
    delete ui;
}

/*
 * UI update functions
 */

void Channellist::clear()
{
    ui->tableWidget->clear();
    for(int i = ui->tableWidget->rowCount(); i != 0; i--)
        ui->tableWidget->removeRow(i - 1);
}

void Channellist::addRow(QString channel)
{
    ui->tableWidget->setHorizontalHeaderLabels(QString("Channel;Users;Topic").split(";"));
    ui->tableWidget->insertRow(ui->tableWidget->rowCount());
    QString name = channel.split(' ').at(3);
    QString users = channel.split(' ').at(4);
    int j = channel.indexOf(QRegularExpression(":.+$"));
    QString topic = channel.right(channel.length() - j - 1);
    ui->tableWidget->setItem(ui->tableWidget->rowCount() - 1, 0, new QTableWidgetItem(name));
    ui->tableWidget->setItem(ui->tableWidget->rowCount() - 1, 1, new QTableWidgetItem(users));
    ui->tableWidget->setItem(ui->tableWidget->rowCount() - 1, 2, new QTableWidgetItem(topic));
}


void Channellist::on_tableWidget_doubleClicked(const QModelIndex &index)
{
    QString channel = ui->tableWidget->item(index.row(), 0)->text();
    channel.prepend("JOIN ");
    channel.append('\n');
    socket->write(channel.toUtf8());
}
