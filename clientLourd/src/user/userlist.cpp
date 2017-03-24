#include "userlist.h"

#include "user.h"

UserList::UserList()
{
}


QStringList UserList::getusers()
{
    QStringList tmp;
    for(auto i:users) {
            tmp.append(i->name());
    }
    return tmp;
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

void UserList::modeM(bool mode, QString user)
{
    for(auto i:users) {
        if (i->name() == user)
            i->modeM(mode);
    }
}

bool UserList::modeM(QString user)
{
    for (auto i:users) {
        if (i->name() == user)
            return i->modeM();
    }
    return false;
}

User * UserList::addUser(QString nick)
{
    for(auto i:users) {
        if (nick == i->name()) {
            return i;
        }
    }
    User *newUser = new User(nick);
    users.append(newUser);
    return newUser;
}

void UserList::addUser(User *user)
{
    for(auto i:users) {
        if (user->name() == i->name()) {
            return;
        }
    }
    users.append(user);
}

void UserList::deleteUser(QString nick)
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
