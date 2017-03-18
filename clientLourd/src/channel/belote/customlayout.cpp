#include "customlayout.h"
#include <QDebug>
CustomLayout::CustomLayout()
{

}

CustomLayout::~CustomLayout()
{
    QLayoutItem *item;
    while((item = layout->takeAt(0))) {
        if (item->widget()) {
            qDebug() << "deleting stuff";
            delete item->widget();
        }
    }
}

void CustomLayout::setLayout(QHBoxLayout *lay)
{
    layout = lay;
}

void CustomLayout::addButton(QString name, int value)
{
    QPushButton *but = new QPushButton(name);
    but->setText(name);
    buttons[but] = value;
    layout->addWidget(but);
    connect(but, &QPushButton::pressed, this, &CustomLayout::clicked);
}

void CustomLayout::clicked()
{
    for (auto i:buttons.keys()) {
        if (i->isDown())
            emit isClicked(buttons[i], this);
    }
}
