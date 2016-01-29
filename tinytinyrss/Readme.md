# [TinyTinyRSS](https://tt-rss.org/)

## Local usage

```
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_USER=tinytiny --name tinytinyrssdb -d postgres
docker run -e DB_ENV_PASS=password -e DB_ENV_USER=tinytiny -e DB_HOST=tinytinyrssdb -e DB_PORT=5432 -e SELF_URL_PATH=https://feeds.mais-h.eu --link tinytinyrssdb clue/ttrss
```

## Kubernetes usage

```
gcloud compute disks create --size 10GB tinytinyrssdb-disk --zone europe-west1-b
kubectl create -f tinytinyrssdb-controller.yaml
kubectl create -f tinytinyrssdb-service.yaml
kubectl create -f tinytinyrss-controller.yaml
kubectl create -f tinytinyrss-service.yaml

kubectl rolling-update tinytinyrss-v5 -f tinytinyrss-controller.yaml
```
