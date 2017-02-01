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
    login.cpp \
    listchannel.cpp \
    mainframe.cpp

HEADERS  += \
    login.h \
    listchannel.h \
    mainframe.h

FORMS    += \
    login.ui \
    listchannel.ui \
    mainframe.ui
