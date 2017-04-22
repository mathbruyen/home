# [Nginx](http://nginx.org/)

## Certificates

Certificates generated using [Let's encrypt](../letsencrypt). HTTP requests for ACME challenges are forwarded to the single letsencrypt pod.

```
# increment version and use new web certificates version in controller
kubectl rolling-update web-v18 -f web-controller.yaml
```

## Kubernetes usage

```
./generate-certificates-secret.sh
kubectl create -f web-certificates.yaml

kubectl create configmap web-config-v1 --from-file=conf

kubectl create -f web-controller.yaml
kubectl create -f web-service.yaml

kubectl rolling-update web-v5 -f web-controller.yaml
```
