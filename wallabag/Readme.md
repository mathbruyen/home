# [Wallabag](https://www.wallabag.org/)

## Local usage

```
docker build .
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_USER=wallabag --name wallabagdb -d postgres
docker run --rm --link wallabagdb 7d15c2f62ede sh -c 'composer run-script build-parameters && php bin/console doctrine:schema:create'
docker run -e WALLABAG_SECRET=supersecret --link wallabagdb 7d15c2f62ede

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
