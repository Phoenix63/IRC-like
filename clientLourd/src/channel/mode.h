#ifndef MODE_H
#define MODE_H


class Mode
{
public:
    Mode();
    // Getters
    void chanOperator(bool b);
    void chanVoice(bool b);
    // Setters
    bool chanOperator();
    bool chanVoice();
private:
    bool isOperator;
    bool isVoice;
};

#endif // MODE_H
