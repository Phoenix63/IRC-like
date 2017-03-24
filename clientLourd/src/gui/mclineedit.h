#ifndef GUI_MCLINEEDIT_H
#define GUI_MCLINEEDIT_H

#include <QLineEdit>

class MCLineEdit : public QLineEdit
{
    Q_OBJECT
public:
    explicit MCLineEdit(QWidget *parent = 0);
    void setMultipleCompleter(QCompleter*);

protected:
    void keyPressEvent(QKeyEvent *e);

private:
    QString cursorWord(const QString& sentence) const;

private slots:
    void insertCompletion(QString);

private:
    QCompleter* completer;
};

#endif // MCLINEEDIT_H
