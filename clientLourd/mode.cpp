#include "mode.h"

Mode::Mode() :
    isOperator(false),
    isVoice(false)
{

}

/*
 * Getters
 */
bool Mode::chanOperator()
{
    return isOperator;
}

bool Mode::chanVoice()
{
    return isVoice;
}

/*
 * Setters
 */
void Mode::chanOperator(bool b)
{
    isOperator = b;
}

void Mode::chanVoice(bool b)
{
    isVoice = b;
}
