# [Nginx](http://nginx.org/)

## [Let's encrypt](https://letsencrypt.org/)

```
# In initial terminal
docker run -it --rm --name letsencrypt -v ~/certs:/etc/letsencrypt -v ~/letsencrypt-backup:/var/lib/letsencrypt quay.io/letsencrypt/letsencrypt:latest certonly --manual -d feeds.mais-h.eu # get ACME challenge

# In another terminal
vim conf/ttrss.conf # set ACME challenge
vim generate-web-config.sh # increment version
./geneate-web-config.sh
kubectl create -f web-configuration.yaml
vim web-controller.yaml # increment version and use new web config version
kubectl rolling-update web-v17 -f web-controller.yaml

# Validate in initial terminal ENTER

vim generate-certificates-secret.sh # increment version
./generate-certificates-secret.sh
kubectl create -f web-certificates.yaml
vim web-controller.yaml # increment version and use new web certificates version
kubectl rolling-update web-v18 -f web-controller.yaml
```

## Kubernetes usage

```
./generate-certificates-secret.sh
kubectl create -f web-certificates.yaml

./generate-web-config.sh
kubectl create -f web-configuration.yaml

kubectl create -f web-controller.yaml
kubectl create -f web-service.yaml

kubectl rolling-update web-v5 -f web-controller.yaml
```
