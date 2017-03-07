#ifndef USERLIST_H
#define USERLIST_H

#include "user.h"

class UserList
{
public:
    UserList();

    // Setters
    void modeI(bool mode, QString user);
    void modeO(bool mode, QString user);
    void modeW(bool mode, QString user);

    //User functions
    User * addUser(QString nick);
    void addUser(User *user);
    void delUser(QString nick);
    void renameUser(QString oldNick, QString newNick);

private:
    QList<User *> users;
};

#endif // USERLIST_H
