# [Wallabag](https://www.wallabag.org/)

## Local usage

```
docker build -t mathbruyen/wallabag:20160128 .
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_USER=wallabag --name wallabagdb -d postgres
docker run -e WALLABAG_SECRET=supersecret --link wallabagdb mathbruyen/wallabag:20160128
docker push mathbruyen/wallabag:20160128
```

## Kubernetes usage

```
gcloud compute disks create --size 10GB wallabagdb-disk --zone europe-west1-b
kubectl create -f wallabagdb-controller.yaml
kubectl create -f wallabagdb-service.yaml
kubectl create -f wallabag-controller.yaml
kubectl create -f wallabag-service.yaml
kubectl exec wallabag-v1-flnjd -c wallabag -i -t -- php bin/console wallabag:install

kubectl rolling-update wallabag-v5 -f wallabag-controller.yaml
```
