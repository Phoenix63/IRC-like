#ifndef CHANNEL_BELOTE_SCOREBOARD_H
#define CHANNEL_BELOTE_SCOREBOARD_H

#include <QDialog>

class ThemeList;
namespace Ui {
class ScoreBoard;
}

class ScoreBoard : public QDialog
{
    Q_OBJECT

public:
    explicit ScoreBoard(QWidget *parent = 0);
    ~ScoreBoard();

    void addRound(QString taker, int trump);
    void addScore(QString scores);
private:
    Ui::ScoreBoard *ui;
    ThemeList *theme;
};

#endif // SCOREBOARD_H
