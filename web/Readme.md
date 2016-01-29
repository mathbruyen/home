# [Nginx](http://nginx.org/)

## [Let's encrypt](https://letsencrypt.org/)

```
git clone https://github.com/letsencrypt/letsencrypt

sudo ln -s /home/mathbruyen/certs /etc/letsencrypt
rm -R ~/.local/share/letsencrypt/
./letsencrypt-auto certonly --manual
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
