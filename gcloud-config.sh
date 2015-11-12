#!/bin/sh

# Deploy:
# docker build -t mathbruyen/sshd:0.0.2
# docker push

# Temp testing:
# docker run --rm -it --name gcloud -v /home/core/aws:/kube mathbruyen/sshd:0.0.2 /bin/sh

# SSH endpoint:
# bash
# env CLOUDSDK_CORE_DISABLE_PROMPTS=1 gcloud components update kubectl -> move to Dockerfile
# gcloud auth login
# gcloud container clusters get-credentials ownservices --zone europe-west1-b



PROJECT="ownservices-1121"
ZONE="europe-west1-b"
CLUSTER="ownservices"

gcloud container clusters create $CLUSTER --zone $ZONE
kubectl create -f sshd-controller.yaml
kubectl create -f sshd-service.yaml