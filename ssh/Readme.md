# SSH on port 443

## Get access to gcloud tooling

```
bash
env CLOUDSDK_CORE_DISABLE_PROMPTS=1 gcloud components update kubectl
gcloud auth login
gcloud container clusters get-credentials ownservices --zone europe-west1-b
```

## Kubernetes usage

```
docker build -t mathbruyen/sshd:0.0.2 .
docker push mathbruyen/sshd:0.0.2 .

kubectl create -f sshd-controller.yaml
kubectl create -f sshd-service.yaml
```
