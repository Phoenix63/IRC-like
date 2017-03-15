#-------------------------------------------------
#
# Project created by QtCreator 2017-01-31T23:43:32
#
#-------------------------------------------------
MAKEFILE += chatIRC.make

MOC_DIR += mocs
OBJECTS_DIR += objects
UI_DIR += uis
QT       += core gui
QT       += network
RC_FILE = src/gui/myapp.rc


greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = chatIRC
TEMPLATE = app


SOURCES += \
    src/main.cpp \
    src/channel/channel.cpp \
    src/channel/channelcontent.cpp \
    src/channel/message.cpp \
    src/channel/mode.cpp \
    src/channel/parseremoji.cpp \
    src/config/config.cpp \
    src/config/configlist.cpp \
    src/config/theme.cpp \
    src/config/themelist.cpp \
    src/gui/channellist.cpp \
    src/gui/login.cpp \
    src/gui/mainframe.cpp \
	src/gui/mclineedit.cpp \
    src/gui/msglist.cpp \
    src/gui/uploadfile.cpp \
    src/parser/parser.cpp \
    src/parser/parsermode.cpp \
    src/user/user.cpp \
    src/user/userlist.cpp \
    src/gui/uploadwindow.cpp


HEADERS  += \
    src/channel/channel.h \
    src/channel/channelcontent.h \
    src/channel/message.h \
    src/channel/mode.h \
    src/channel/parseremoji.h \
    src/config/config_in.h \
    src/config/config.h \
    src/config/configlist.h \
    src/config/theme_in.h \
    src/config/theme.h \
    src/config/themelist.h \
    src/gui/channellist.h \
    src/gui/login.h \
    src/gui/mainframe.h \
	src/gui/mclineedit.h \
    src/gui/msglist.h \
    src/gui/uploadfile.h \
    src/parser/err_response.h \
    src/parser/parser.h \
    src/parser/parsermode.h \
    src/parser/rpl_response.h \
    src/user/user.h \
    src/user/userlist.h \
    src/gui/uploadwindow.h

FORMS    += \
    src/gui/login.ui \
    src/gui/mainframe.ui \
    src/gui/channellist.ui \
    src/gui/uploadwindow.ui

RESOURCES += \
    src/gui/myapp.rc
