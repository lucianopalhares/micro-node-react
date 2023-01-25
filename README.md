# Micro serviço com react/node/kubernetes

## VERSAO 1.0 (simplicidade é tudo)

### Primeiro fazer o clone do projeto

```
git clone git@github.com:lucianopalhares/micro-node-react.git 
```

Va para raiz do projeto 

```
cd micro-node-react
```

### Assumindo que ja possui instalado docker, minikube e skaffold

### Configure a url

Digite o seguinte comando para descobrir o ip do minikube

```
minikube ip
```

Adicione o ip no hosts

```
sudo nano /etc/hosts
```

Adicione no arquivo a linha

```
ip-do-minikube     posts.com
```

### Execute o comando para iniciar o skaffold

```
skaffold dev
```
Se tudo der certo as imagens docker serao iniciadas com seus devidos conteiners, e o npm sera executado

### Acesso

Acesse a url:

```
posts.com
```

E teste a aplicação!!!







