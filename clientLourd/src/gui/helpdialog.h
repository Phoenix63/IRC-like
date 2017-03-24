#ifndef HELPDIALOG_H
#define HELPDIALOG_H

#include <QDialog>
#include <QHash>

class QString;

namespace Ui {
class HelpDialog;
}

class HelpDialog : public QDialog
{
    Q_OBJECT

public:
    explicit HelpDialog(QWidget *parent = 0);
    ~HelpDialog();

private slots:
    void on_commandList_itemSelectionChanged();

private:
    void setHelp();

private:
    Ui::HelpDialog *ui;
    QHash<QString, QString> help;
};

#endif // HELPDIALOG_H
