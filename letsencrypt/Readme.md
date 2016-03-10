# SSL certificates generation

Machine running a webserver for providing ACME challenges, and accepting shell connections to generate them. All web servers must redirect `/.well-known/acme-challenge` to this machine.

```
gcloud compute disks create --size 1GB letsencrypt-certificates --zone europe-west1-b

kubectl exec letsencrypt-9anqi -c letsencrypt -i -t -- letsencrypt certonly --webroot --webroot-path /acme --email letsencrypt@mais-h.eu -d feeds.mais-h.eu
vim generate-certificates-secret.sh # increment version
./generate-certificates-secret.sh
kubectl create -f web-certificates.yaml
```

Webservers redirect ACME challenges to this machine:

```nginx
server {
  listen 80;
  server_name example.com;
  location /.well-known/acme-challenge {
    proxy_pass http://letsencrypt:80;
  }
}
```
