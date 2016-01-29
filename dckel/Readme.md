# DCKEL

## Local usage

```
git clone https://mathbruyen@bitbucket.org/mathbruyen/dckel-website.git
cd dckel-website

docker build -t mathbruyen/dckel:20160128 .
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_USER=dckel --name dckeldb -d postgres
docker run -e DB=postgres://dckel:password@dckeldb:5432/dckel -e SECRET=supersecret -e PORT=80 --link dckeldb mathbruyen/dckel:20160128
docker push mathbruyen/dckel:20160128
```

## Kubernetes usage

```
gcloud compute disks create --size 10GB dckeldb-disk --zone europe-west1-b
kubectl create -f dckeldb-controller.yaml
kubectl create -f dckeldb-service.yaml
kubectl create -f dckel-controller.yaml
kubectl create -f dckel-service.yaml

kubectl rolling-update dckel-v5 -f dckel-controller.yaml
```
