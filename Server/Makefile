.SILENT:

all:
	make help

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
	echo -e "        \_/ / #  \    /  # \ \_/    \e[0mServer\033[0;32m    "
	echo -e "          | |     \  /     | |        \e[0m(v0.1.0)\033[0;32m "
	echo -e "          |  \____/  \____/  |        "
	echo -e "          ||       @@        |        "
	echo -e "          ||     \_/\_/      |        "
	echo -e "           \________________/        "
	echo -e "\e[0m"

help:
	make head
	echo "      Commands: "
	echo
	echo "            help - Show this message"
	echo
	echo "            ------- Running commands -------"
	echo -e "            \033[0;32mdev\e[0m  - Run the server in  dev environment"
	echo -e "            \033[0;32mprod\e[0m - Run the server in prod environment"
	echo
	echo -e "            ------- Testing commands -------"
	echo -e "            \033[0;32munit\e[0m - Run the server in test environment"
	echo
	echo -e "            ------- Building commands -------"
	echo -e "            \033[0;32mbuild\e[0m - Build  image  used   for  node"
	echo -e "            \033[0;32mdeps\e[0m  - install project's dependencies"
	echo
	echo -e "            ------- Cleaning project --------"
	echo -e "            \033[0;32mclean\e[0m - clean docker-compose"
	echo

build:
	make head
	docker pull bitnami/node:7
	docker build -f docker/runtest.Dockerfile -t pandirc/runtest .
	docker build -f docker/dev.Dockerfile -t pandirc/dev .

deps:
	make head
	docker-compose -f ./docker/deps.yml up

prod:
	make head
	docker-compose -f ./docker/prod.yml up

dev:
	make head
	docker-compose -f ./docker/dev.yml up

file:
	make head
	docker-compose -f ./docker/fileserver.yml up

unit:
	make head
	docker-compose -f ./docker/test.yml up

clean:
	docker-compose -f ./docker/deps.yml rm -f
	docker-compose -f ./docker/test.yml rm -f
	docker-compose -f ./docker/prod.yml rm -f
	docker-compose -f ./docker/dev.yml rm -f
	docker-compose -f ./docker/fileserver.yml rm -f