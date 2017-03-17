#include "card.h"

Card::Card(int valeur) :
    aSuit(valeur / 8),
    aRank(valeur % 8)
{
    points[0] = 0;
    points[1] = 0;
    points[2] = 0;
    points[3] = 10;
    points[4] = 2;
    points[5] = 3;
    points[6] = 4;
    points[7] = 11;
    value(points[aRank]);
}

int Card::suit()
{
    return aSuit;
}

int Card::rank()
{
    return aRank;
}

int Card::value()
{
    return aValue;
}

int Card::code()
{
    return suit() * 8 + rank();
}

void Card::value(int val)
{
    aValue = val;
}

void Card::updateValue(int trump)
{
    if(rank() == 2) {
        suit() == trump ? value(14) : value(0);
    } else if(rank() == 4) {
        suit() == trump ? value(20) : value(2);
    }
}
