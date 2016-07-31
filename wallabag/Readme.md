# [Wallabag](https://www.wallabag.org/)

## Local usage

```
docker build -t mathbruyen/wallabag:20160731 .
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_USER=wallabag --name wallabagdb -d postgres:9.5
docker run --link wallabagdb -e SYMFONY__WALLABAG_DB_HOST=wallabagdb -e SYMFONY__WALLABAG_DB_NAME=wallabag -e SYMFONY__WALLABAG_DB_USER=wallabag -e SYMFONY__WALLABAG_DB_PASSWORD=password -e SYMFONY__WALLABAG_SECRET=supersecret -e SYMFONY__WALLABAG_SMTP_HOST=none --rm -it mathbruyen/wallabag:20160731 sh -c 'composer run-script post-cmd -- --no-interaction && php bin/console wallabag:install'
docker run -e SYMFONY__WALLABAG_DB_HOST=wallabagdb -e SYMFONY__WALLABAG_DB_NAME=wallabag -e SYMFONY__WALLABAG_DB_USER=wallabag -e SYMFONY__WALLABAG_DB_PASSWORD=password -e SYMFONY__WALLABAG_SECRET=supersecret -e SYMFONY__WALLABAG_SMTP_HOST=none --link wallabagdb -p 8080:80 --rm -it mathbruyen/wallabag:20160731

docker push mathbruyen/wallabag:20160731
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
