#include "userlist.h"

UserList::UserList()
{
}

void UserList::modeI(bool mode, QString user)
{
    for(auto i:users) {
        if (i->name() == user)
            i->modeI(mode);
    }
}

void UserList::modeO(bool mode, QString user)
{
    for(auto i:users) {
        if (i->name() == user)
            i->modeO(mode);
    }
}

void UserList::modeW(bool mode, QString user)
{
    for(auto i:users) {
        if (i->name() == user)
            i->modeW(mode);
    }
}

User * UserList::addUser(QString nick)
{
    User *newUser = new User(nick);
    users.append(newUser);
    return newUser;
}

void UserList::addUser(User *user)
{
    users.append(user);
}

void UserList::delUser(QString nick)
{
    for(auto i:users) {
        if (i->name() == nick)
            users.removeOne(i);
    }
}

void UserList::renameUser(QString oldNick, QString newNick)
{
    for (auto i:users) {
        if (i->name() == oldNick)
            i->name(newNick);
    }
}
