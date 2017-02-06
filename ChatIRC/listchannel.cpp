#include "listchannel.h"
#include "ui_listchannel.h"

ListChannel::ListChannel(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::ListChannel)
{
    ui->setupUi(this);
}

ListChannel::~ListChannel()
{
    delete ui;
}
