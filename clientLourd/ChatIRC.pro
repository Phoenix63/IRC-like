#-------------------------------------------------
#
# Project created by QtCreator 2017-01-31T23:43:32
#
#-------------------------------------------------

QT       += core gui
QT       += network
RC_FILE = myapp.rc

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = chatIRC
TEMPLATE = app


SOURCES += main.cpp\
    login.cpp \
    mainframe.cpp \
    parser.cpp \
    channel.cpp \
    msglist.cpp \
    channelcontent.cpp \
    parseremoji.cpp \
    channellist.cpp

HEADERS  += \
    login.h \
    mainframe.h \
    channel.h \
    parser.h \
    msglist.h \
    err_response.h \
    rpl_response.h \
    channelcontent.h \
    parseremoji.h \
    channellist.h \
    theme.h

FORMS    += \
    login.ui \
    mainframe.ui \
    channellist.ui

RESOURCES +=
