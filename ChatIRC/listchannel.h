#ifndef LISTCHANNEL_H
#define LISTCHANNEL_H

#include <QWidget>

namespace Ui {
class ListChannel;
}

class ListChannel : public QWidget
{
    Q_OBJECT
    
public:
    explicit ListChannel(QWidget *parent = 0);
    ~ListChannel();
    
private:
    Ui::ListChannel *ui;
};

#endif // LISTCHANNEL_H
