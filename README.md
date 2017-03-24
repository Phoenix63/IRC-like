# IRC-like
Chat IRC-like

## 1. SERVER

```
cd Server
```

### 1.1 Requirement

Tu run the server you need to have docker

https://www.docker.com/

**For windows you also need to have NPM and NODEJS both installed and in your PATH**

### 1.2 Run server
#### 1.2.1 Linux

```
make
```

**Instalation**

```
make build
make deps
```

Now with make you can run the server in different environments:
- ```make dev``` -> run in dev env
- ```make prod``` -> run in prod env
- ```make unit``` -> run tests

#### 1.2.2 Windows

```
docker pull bitnami/node:7
docker build -f docker/runtest.Dockerfile -t pandirc/runtest .
docker build -f docker/dev.Dockerfile -t pandirc/dev .
docker-compose -f ./docker/deps.yml up
```

Now with make you can run the server in different environments:
- ```npm run dev``` -> run in dev env
- ```npm run prod``` -> run in prod env
- ```npm run test``` -> run tests




