.SILENT:

all:
	make compile

head:
	echo
	echo -e "\033[0;32m "
	echo -e "__________                    .__/\.______________________  "
	echo -e "\______   \_____    ____    __| _)/|   \______   \_   ___ \ "
	echo -e " |     ___/\__  \  /    \  / __ |  |   ||       _/    \  \/ "
	echo -e " |    |     / __ \|   |  \/ /_/ |  |   ||    |   \     \____"
	echo -e " |____| ___|____/|___|__/\____ _|  |___||____|_  /\______  /"
	echo -e "       //  \________________//  \              \/        \/ "
	echo -e "       \ \ / ____      ____ \   /      "
	echo -e "        \_/ / #  \    /  # \ \_/    \e[0mClientLourd\033[0;32m    "
	echo -e "          | |     \  /     | |        \e[0m(v0.1.0)\033[0;32m "
	echo -e "          |  \____/  \____/  |        "
	echo -e "          ||       @@        |        "
	echo -e "          ||     \_/\_/      |        "
	echo -e "           \________________/        "
	echo -e "\e[0m"

compile:
	make head
	echo -e "> executing qmake ..."
	qmake ChatIRC.pro
	echo -e "> compiling ..."
	make -f chatIRC.make
	echo -e "> done"

clean:
	make head
	echo -e "> cleaning object and moc files ..."
	make -f chatIRC.make clean
	rm mocs objects uis *.qrc *.make -r
	echo -e "> done"
