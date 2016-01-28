# Wallabag

## Local usage

```
docker build -t mathbruyen/wallabag:20160128 .
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_USER=wallabag --name wallabagdb -d postgres
docker run -e WALLABAG_SECRET=supersecret --link wallabagdb mathbruyen/wallabag:20160128
docker push mathbruyen/wallabag:20160128
```

## Kubernetes usage

```
kubectl create -f wallabagdb-controller.yaml
kubectl create -f wallabagdb-service.yaml
kubectl create -f wallabag-controller.yaml
kubectl create -f wallabag-service.yaml

kubectl rolling-update wallabag-v5 -f wallabag-controller.yaml
```
