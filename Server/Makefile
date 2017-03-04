.SILENT:

help:
	echo
	echo "PandIrc Server"
	echo
	echo "      Commands: "
	echo
	echo "            help - Show this message"
	echo
	echo "            ------- Running commands -------"
	echo -e "            \033[0;32mdev\e[0m  - Run the server in  dev environment"
	echo -e "            \033[0;32mprod\e[0m - Run the server in prod environment"
	echo
	echo -e "            ------- Testing commands -------"
	echo -e "            \033[0;32mtest\e[0m - Run the server in test environment"
	echo
	echo -e "            ------- Building commands -------"
	echo -e "            \033[0;32mbuild\e[0m - Build  image  used   for  node"
	echo -e "            \033[0;32mdeps\e[0m  - install project's dependencies"
	echo
	echo -e "            ------- Cleaning project --------"
	echo -e "            \033[0;32mclean\e[0m - clean docker-compose"
	echo

build: clean
	docker pull bitnami/node:7
	docker build -f docker/runtest.Dockerfile -t pandirc/runtest .

deps: clean
	docker-compose -f ./docker/deps.yml up

prod: clean
	docker-compose -f ./docker/prod.yml up

dev: clean
	docker-compose -f ./docker/dev.yml up

test: clean
	docker-compose -f ./docker/test.yml up

clean:
	docker-compose -f ./docker/deps.yml rm -f
	docker-compose -f ./docker/test.yml rm -f
	docker-compose -f ./docker/prod.yml rm -f
	docker-compose -f ./docker/dev.yml rm -f