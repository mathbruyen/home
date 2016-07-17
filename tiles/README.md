# Proxy tile server

Local proxy:

```
docker run -v $(pwd)/conf:/etc/nginx/conf.d:ro -v $(pwd)/cache:/tiles -p 8080:80 --rm nginx:1.10.0-alpine
```

Kubernetes usage:

```
kubectl create configmap tiles-config-v1 --from-file=conf
kubectl create -f tiles-service.yaml
kubectl create -f tiles-controller.yaml
```
