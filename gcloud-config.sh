#!/bin/sh

# Deploy:
# docker build -t mathbruyen/sshd:0.0.2
# docker push

# Temp testing:
# docker run --rm -it --name gcloud -v /home/core/aws:/kube mathbruyen/sshd:0.0.2 /bin/sh
# kubectl exec wallabag-v1-flnjd -c wallabag -i -t -- bash -il
# kubectl exec wallabag-v1-flnjd -c wallabag -i -t -- php app/console wallabag:install
# kubectl exec wallabag-v1-gwk26 -c wallabagdb -i -t -- psql -U wallabag -d wallabag
# kubectl rolling-update xxx-vY -f xxx-controller.yaml

# SSH endpoint:
# bash
# env CLOUDSDK_CORE_DISABLE_PROMPTS=1 gcloud components update kubectl -> move to Dockerfile
# gcloud auth login
# gcloud container clusters get-credentials ownservices --zone europe-west1-b

# Lets encrypt
# sudo ln -s /home/mathbruyen/certs /etc/letsencrypt
# git clone https://github.com/letsencrypt/letsencrypt
# rm -R ~/.local/share/letsencrypt/
# ./letsencrypt-auto certonly --manual

PROJECT="ownservices-1121"
ZONE="europe-west1-b"
CLUSTER="ownservices"

gcloud container clusters create $CLUSTER --zone $ZONE
kubectl create -f sshd-controller.yaml
kubectl create -f sshd-service.yaml
gcloud compute disks create --size 10GB tinytinyrssdb-disk --zone europe-west1-b
gcloud compute disks create --size 10GB wallabagdb-disk --zone europe-west1-b
