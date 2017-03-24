#include "mclineedit.h"
#include <QCompleter>
#include <QTextCursor>
#include <QAbstractItemView>
#include <QScrollBar>
#include <QKeyEvent>

MCLineEdit::MCLineEdit(QWidget *parent) :
    QLineEdit(parent)
{
}
void MCLineEdit::keyPressEvent(QKeyEvent *e)
{
    if (completer && completer->popup()->isVisible()) {
        // The following keys are forwarded by the completer to the widget
        switch (e->key()) {
        case Qt::Key_Enter:
        case Qt::Key_Return:
        case Qt::Key_Escape:
        case Qt::Key_Tab:
        case Qt::Key_Backtab:
            e->ignore();
            return; // let the completer do default behavior
        default:
            break;
        }
    }
    QLineEdit::keyPressEvent(e);
    if (!completer)
        return;
    completer->setCompletionPrefix(cursorWord(this->text()));
    if (completer->completionPrefix().length() < 1)
    {
        completer->popup()->hide();
        return;
    }
    QRect cr = cursorRect();
         cr.setWidth(completer->popup()->sizeHintForColumn(0)
                     + completer->popup()->verticalScrollBar()->sizeHint().width());
    completer->complete(cr);
}
QString MCLineEdit::cursorWord(const QString &sentence) const
{
    return sentence.mid(sentence.left(cursorPosition()).lastIndexOf(" ") + 1, cursorPosition() - sentence.left(cursorPosition()).lastIndexOf(" ") - 1);
}

void MCLineEdit::insertCompletion(QString arg)
{
    setText(text().replace(text().left(cursorPosition()).lastIndexOf(" ") + 1, cursorPosition() - text().left(cursorPosition()).lastIndexOf(" ") - 1, arg));
}

void MCLineEdit::setMultipleCompleter(QCompleter* comp)
{
    completer = comp;
    completer->setWidget(this);
    connect(completer, SIGNAL(activated(QString)), this, SLOT(insertCompletion(QString)));
}
