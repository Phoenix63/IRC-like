.SILENT:
NODE := $(shell which node 2> /dev/null)
all:
	echo ""

	@while [ -z "$$CONTINUE" ]; do \
		read -r -p "[Y]es: build Server, [N]o show help [y/N]: " CONTINUE; \
	done ; \
	[ $$CONTINUE = "y" ] || [ $$CONTINUE = "Y" ] || (make help; exit 1)
	make build
	make deps
	make unit

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
	echo -e "          | |     \  /     | |        \e[0m(v1.0.0)\033[0;32m "
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
	echo -e "            ------- Running commands -------"
	echo -e "            \033[0;32mdev\e[0m  - Run the server in  dev environment"
	echo -e "            \033[0;32mprod\e[0m - Run the server in prod environment"
	echo -e "            \033[0;32mprod-deamon\e[0m - Run the server in prod environment is deamon mode"
	echo -e "            \033[0;32mstats\e[0m - See server CPU and RAM usage (NodeJS required)"
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
	docker volume create --name=mongoirc
	docker pull bitnami/node:7
	docker pull redis:3.2
	docker pull mongo:3.4
	docker build -f docker/runtest.Dockerfile -t pandirc/runtest .
	docker build -f docker/dev.Dockerfile -t pandirc/dev .

deps:
	make head
	docker-compose -f docker/deps.yml up --abort-on-container-exit

prod:
	make head
	docker-compose -f docker/build.yml up --abort-on-container-exit
	docker-compose -f docker/prod.yml up

prod-daemon:
	make head
	docker-compose -f docker/build.yml up --abort-on-container-exit
	docker-compose -f docker/prod.yml up

dev:
	make head
	docker-compose -f docker/build.yml up --abort-on-container-exit
	docker-compose -f docker/dev.yml up

stats:
	make head
ifeq ($(NODE),)
	exit 0
	echo "This command require NodeJS"
	exit 1
else
	LIVE=true node src/usage
endif


unit:
	make head
	docker-compose -f docker/build.yml up --abort-on-container-exit
	docker-compose -f docker/test.yml up --abort-on-container-exit

clean:
	docker-compose -f docker/deps.yml rm -f
	docker-compose -f docker/prod.yml rm -f
	docker-compose -f docker/dev.yml rm -f
	docker-compose -f docker/build.yml rm -f