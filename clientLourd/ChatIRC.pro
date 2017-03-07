#-------------------------------------------------
#
# Project created by QtCreator 2017-01-31T23:43:32
#
#-------------------------------------------------
MAKEFILE += chatIRC.make

MOC_DIR += mocs
OBJECTS_DIR += objects
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
    channellist.cpp \
    config.cpp \
    configlist.cpp \
    message.cpp \
    theme.cpp \
    themelist.cpp \
    user.cpp \
    mode.cpp \
    parsermode.cpp \
    userlist.cpp

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
    theme.h \
    config.h \
    configlist.h \
    config_in.h \
    message.h \
    themelist.h \
    theme_in.h \
    user.h \
    mode.h \
    parsermode.h \
    userlist.h

FORMS    += \
    login.ui \
    mainframe.ui \
    channellist.ui

RESOURCES +=
