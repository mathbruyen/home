# Self service

## Init

[kops tutorial](https://github.com/kubernetes/kops/blob/master/docs/aws.md)

## Local usage

[Nix installation](https://github.com/mathbruyen/computers/blob/master/computers/nix/).

```bash
nix-shell
gcloud init
gcloud config set container/cluster ownservices
# get config username
kubectl config view
# get master auth password
gcloud container clusters describe ownservices
kubectl config set-credentials CONFIG_USERNAME --username=admin --password=PASSWORD
```

Display dashboard by running `kubectl proxy` and then open [dashboard](http://localhost:8001/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard)

## Generate secrets and passwords

```
openssl rand -hex 64
```

## Debug

```
kubectl exec wallabag-v1-flnjd -c wallabag -i -t -- bash -il
kubectl exec wallabag-v1-gwk26 -c wallabagdb -i -t -- psql -U wallabag -d wallabag
```
