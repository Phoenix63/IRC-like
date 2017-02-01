#include "login.h"
#include "mainframe.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    Login log;
    log.show();
    return a.exec();
}
