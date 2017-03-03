#include "channellist.h"
#include "ui_channellist.h"

#include <QDebug>
/*
 * Constructor and destructor
 */

Channellist::Channellist(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Channellist)
{
    ui->setupUi(this);
    ui->tableWidget->setColumnCount(4);
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
    ui->tableWidget->setHorizontalHeaderLabels(QString("Mode;Channel;Users;Topic").split(";"));
    ui->tableWidget->insertRow(ui->tableWidget->rowCount());
    QString name = channel.split(' ').at(3);
    QString users = channel.split(' ').at(4);
    int j = channel.indexOf(QRegularExpression(":.+$"));
    QString topic = channel.right(channel.length() - j - 1);
    ui->tableWidget->setItem(ui->tableWidget->rowCount() - 1, 1, new QTableWidgetItem(name));
    ui->tableWidget->setItem(ui->tableWidget->rowCount() - 1, 2, new QTableWidgetItem(users));
    ui->tableWidget->setItem(ui->tableWidget->rowCount() - 1, 3, new QTableWidgetItem(topic));
}
