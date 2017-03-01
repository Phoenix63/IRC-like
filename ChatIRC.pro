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
<<<<<<< HEAD
    parseremoji.cpp \
    channellist.cpp
=======
>>>>>>> origin/ClientLourd

HEADERS  += \
    login.h \
    mainframe.h \
    channel.h \
    parser.h \
    msglist.h \
<<<<<<< HEAD
    err_response.h \
    rpl_response.h \
    channelcontent.h \
    parseremoji.h \
    channellist.h
=======
    channelcontent.h 
>>>>>>> origin/ClientLourd

FORMS    += \
    login.ui \
    mainframe.ui

RESOURCES +=
