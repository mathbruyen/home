# [Wallabag](https://www.wallabag.org/)

## Local usage

```
docker build .
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_USER=wallabag --name wallabagdb -d postgres
docker run --rm --link wallabagdb -e SYMFONY__WALLABAG_DB_HOST=wallabagdb -e SYMFONY__WALLABAG_DB_NAME=wallabag -e SYMFONY__WALLABAG_DB_USER=wallabag -e SYMFONY__WALLABAG_DB_PASSWORD=password 75df03d864b7 sh -c 'composer run-script build-parameters -- --no-interaction && php bin/console doctrine:schema:create'
docker run -e SYMFONY__WALLABAG_DB_HOST=wallabagdb -e SYMFONY__WALLABAG_DB_NAME=wallabag -e SYMFONY__WALLABAG_DB_USER=wallabag -e SYMFONY__WALLABAG_DB_PASSWORD=password --link wallabagdb -p 8080:80 75df03d864b7

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
