#include "customlayout.h"
#include <QDebug>
CustomLayout::CustomLayout()
{

}

void CustomLayout::setLayout(QHBoxLayout *lay)
{
    layout = lay;
}

void CustomLayout::addButton(QString name, int value)
{
    QPushButton *but = new QPushButton(name);
    but->setText(name);
    but->setStyleSheet("background-color: rgba( 255, 255, 255, 100% );");
    qDebug() << "created button " << name << buttons.keys().size();
    buttons[but] = value;
    connect(but, &QPushButton::pressed, this, &CustomLayout::clicked);
}

void CustomLayout::clicked()
{
    for (auto i:buttons.keys()) {
        if (i->isDown())
            emit isClicked(buttons[i], this);
    }
}
