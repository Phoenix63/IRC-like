#ifndef CHANNEL_BELOTE_CARD_H
#define CHANNEL_BELOTE_CARD_H

#include <QVector>

class Card
{
public:
    Card(int valeur);
    int suit();
    int rank();
    int value();
    void value(int val);
    void updateValue(int trump);
    int code();
private:
    int aSuit;
    int aRank;
    int aValue;
    int points [8];
};

#endif // CARD_H
