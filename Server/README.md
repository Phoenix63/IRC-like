# Server

## Requirements

To run the project you need to have docker and docker-compose installed.

```
git clone https://github.com/Phoenix63/IRC-like.git
```

then change folders

```
cd IRC-like/Server
```

## Build project

```
make
```

and then you have to install all dependancies

**If there are troubles you can run**

```
docker build -f docker/dev.Dockerfile -t pandirc/dev .
docker build -f docker/runtest.Dockerfile -t pandirc/runtest .
```

## Run server

There are 2 environments for running code :
- development ```make dev```
- production ```make prod-daemon``` or ```make prod```

**SIGINT close the server**

If you have NodeJS installed or your machine you can see server stats with ```make stats```

