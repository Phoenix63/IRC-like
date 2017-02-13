#ifndef PARSEUR_H
#define PARSEUR_H

#include <QString>

#include "channel.h"

class Parseur {
private:
//In private function

bool in_isChanList(QString string);
bool in_isNameList(QString string);
bool in_isJoinNote(QString string);
bool in_isPartNote(QString string);
bool in_isPrivMesg(QString string);
bool in_isWhisMesg(QString string);

public:
    //Initialisation functions
    void setChannel(Channel *channel);

    //Parsing functions
    void out(QString *string);
    void in(QString string);

private:
    //Pointer to the channel created in mainframe
    Channel *channel;
};

#endif // PARSEUR_H
