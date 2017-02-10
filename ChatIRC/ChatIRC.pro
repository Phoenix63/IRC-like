#-------------------------------------------------
#
# Project created by QtCreator 2017-01-31T23:43:32
#
#-------------------------------------------------

QT       += core gui
QT += network
RC_FILE = myapp.rc

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = ChatIRC
TEMPLATE = app


SOURCES += main.cpp\
    login.cpp \
    mainframe.cpp \
    parseur.cpp \
    channel.cpp

HEADERS  += \
    login.h \
    mainframe.h \
    parseur.h \
    channel.h

FORMS    += \
    login.ui \
    mainframe.ui

RESOURCES +=