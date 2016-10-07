# Self service

## Services

* feeds: [TinyTinyRSS](./tinytinyrss)
* read it later: [Wallabag](./wallabag)
* backup: [rsync](./files)
* ssh on port 443: [SSH](./ssh)

## Init

```
gcloud container clusters create ownservices --zone europe-west1-b
```

## Local usage

Install kubernetes cli: [link](https://github.com/mathbruyen/computers/blob/master/computers/aspire.md#gcloud-and-kubernetes).

## Generate secrets and passwords

```
openssl rand -hex 64
```

## Debug

```
kubectl exec wallabag-v1-flnjd -c wallabag -i -t -- bash -il
kubectl exec wallabag-v1-gwk26 -c wallabagdb -i -t -- psql -U wallabag -d wallabag
```
