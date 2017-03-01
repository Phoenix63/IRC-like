#include "channellist.h"
#include "ui_channellist.h"

/*
 * Constructor and destructor
 */

Channellist::Channellist(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Channellist)
{
    ui->setupUi(this);
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
    ui->listWidget->clear();
}

void Channellist::addRow(QString channel)
{
    QString name = channel.split(' ').at(3);
    QString users = channel.split(' ').at(4);
    int j = channel.indexOf(QRegularExpression(":.+$"));
    QString topic = channel.right(channel.length() - j - 1);
    ui->listWidget->addItem(name + " " + users + " : " + topic);
}
