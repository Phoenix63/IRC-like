#-------------------------------------------------
#
# Project created by QtCreator 2017-01-31T23:43:32
#
#-------------------------------------------------

QT       += core gui
QT += network

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = ChatIRC
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
    login.cpp \
    listchannel.cpp

HEADERS  += mainwindow.h \
    login.h \
    listchannel.h

FORMS    += mainwindow.ui \
    login.ui \
    listchannel.ui
