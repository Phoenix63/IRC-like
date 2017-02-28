#include "channellist.h"
#include "ui_channellist.h"

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

void Channellist::clear()
{
    ui->listWidget->clear();
}

void Channellist::addRow(QString channel)
{
    QString name = channel.split(' ').at(3);
    QString users = channel.split(' ').at(4);
    int j = channel.indexOf(QRegularExpression(":.+$"));
    QString topic = channel.right(channel.length()-j-1);
    qDebug() << channel;
    qDebug() << "split" << name << users << topic;
    ui->listWidget->addItem(name + " " + users + " : " + topic);
}
