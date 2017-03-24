#include "helpdialog.h"
#include "ui_helpdialog.h"

#include <QList>

HelpDialog::HelpDialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::HelpDialog)
{
    ui->setupUi(this);
    setHelp();
}

HelpDialog::~HelpDialog()
{
    delete ui;
}

void HelpDialog::setHelp()
{
    ui->commandList->setSortingEnabled(true);
    help["away"] = "<h1>/away &lt;message></h1>\n \
Switch to away mode. If someone tries to contact you he will receive the message put in parameter.";
    help["back"] = "<h1>/back</h1>\n \
Switch back from away mode.";
    help["belote"] = "<h1>/belote &lt;channel> </h1> \n \
Join a French Belote game.";
    help["clean"] = "<h1>/clean</h1> \n \
Clear channel content.";
    help["files"] = "<h1>/files &lt;channel></h1> \n \
Access the list of files sent on the channel in parameter, or in the current channel if there is no channel in parameter.";
    help["invite"] = "<h1>/invite &lt;user>&lt;channel></h1> \n \
Invite a user to a private channel. You must be operator to use this command.";
    help["join"] = "<h1>/join &lt;channel></h1> \n \
Join the channel passed in parameter.";
    help["kick"] = "<h1>/kick /lt;user></h1> \n \
Force the user to disconect from the current channel. You must be channel operator to use this command.";
    help["list"] = "<h1>/list</h1>\n \
Return the channel list from the server, their topic and number of user connected.";
    help["user mode"] = "<h1>/mode &lt;channel +/-&lt;flag>{&lt;argument>}</h1>\n \
flag list : b ,i, o, w.";
    help["channel mode"] = "<h1>/mode &lt;channel +/-&lt;flag>{&lt;argument>}</h1>\n \
flag list: B, I ,K ,L, M, N, O ,P, S, T, V.";
    help["msg"] = "<h1>/msg &lt;user> :&lt;message></h1> \n \
Send a private message to a user.";
    help["mute"] = "<h1>/mute &lt;user></h1> \n \
Ignore another user.";
    help["names"] = "<h1>/names &lt;channel></h1> \n \
Return the list of user in the channel passed in parameter. If there is no parameter, the command return the list of user in every channel.";
    help["nick"] = "<h1>/nick &lt;nickname></h1> \n \
Change your nickname.";
    help["part"] = "<h1>/part &lt;channel></h1> \n \
Quit the channel in parameter. If there is no parameter, quit the current channel.";
help["pass"] = "<h1>/pass &lt;password></h1>\n \
Authenticate yourself to the server or change your password if you already used this command once.";
    help["quit"] = "<h1>/quit</h1>\n \
Disconnect from the server.";
    help["rmchan"] = "<h1>/rmchan &lt;channel></h1>\n \
Delete a channel, even if it is not empty. You must be server administrator to use this command.";
    help["rmfile"] = "<h1>/rmfile &lt;url></h1>\n \
Remove the file from the current channel.";
    help["serverkick"] = "<h1>/serverkick &lt;user></h1>\n \
Force the user to disconnect, you need to be server administrator to use this command.";
    help["topic"] = "<h1>/topic &lt;topic></h1>\n \
Change the topic of the current channel. If the topic parameter is empty, gets the current topic.";
    help["unmute"] = "<h1>/unmute &lt;user></h1>\n \
Cancel the mute command.";
    help["user"] = "<h1>/user &lt;identity> 0 * :&lt;realname></h1>\n \
Setup your identity, need to be done to access the other commands.";
    help["who"] = "<h1>/who &lt;channel></h1>\n \
Give informations about every users from that channel.";
    help["whois"] = "<h1>/whois &lt;user></h1>\n \
Give the user's identity and real name.";
    for (auto command:help.keys()) {
        ui->commandList->addItem(command);
}

    QString current = ui->commandList->item(0)->text();
    ui->helpText->setText(help[current]);
}


void HelpDialog::on_commandList_itemSelectionChanged()
{
    QList<QListWidgetItem *> selected = ui->commandList->selectedItems();
    if (!selected.isEmpty()) {
        ui->helpText->setText(help[selected.first()->text()]);
    }
}
