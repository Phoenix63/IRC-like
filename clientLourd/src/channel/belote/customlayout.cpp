#include "customlayout.h"
#include <QDebug>
CustomLayout::CustomLayout()
{

}

CustomLayout::~CustomLayout()
{
    clearLayout(layout);
}

void CustomLayout::clearLayout(QLayout *layout)
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

void CustomLayout::setLayout(QHBoxLayout *lay, QWidget *parent)
{
    layout = lay;
    this->parent = parent;
}

void CustomLayout::addButton(QString name, int value)
{
    QPushButton *but = new QPushButton(parent);
    but->setText(name);
    buttons[but] = value;
    layout->addWidget(but);
    connect(but, &QPushButton::pressed, this, &CustomLayout::clicked);
}

void CustomLayout::clicked()
{
    for (auto i:buttons.keys()) {
        if (i) {
            if (i->isDown()) {
                emit isClicked(buttons[i], this);
            }
        }
    }
}
