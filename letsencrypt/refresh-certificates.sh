#! /bin/bash

POD=$(kubectl get pods --selector app=letsencrypt -o jsonpath='{.items[0].metadata.name}')

function refresh {
  kubectl exec $POD -c letsencrypt -t -- sh -c "TERM=xterm certbot certonly --webroot --webroot-path /acme --agree-tos -m letsencrypt@mais-h.eu -d $1"
}

echo Using $POD
refresh feeds.mais-h.eu
refresh save.mais-h.eu
refresh dckel.mais-h.eu
refresh files.mais-h.eu
refresh blog.mais-h.eu
