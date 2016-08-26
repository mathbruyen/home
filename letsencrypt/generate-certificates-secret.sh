#! /bin/bash

function fetch {
  kubectl exec letsencrypt-g21fo -c letsencrypt -- sh -c "sleep 1 && cat /etc/letsencrypt/live/$1" | openssl enc -A -base64
}

cat > web-certificates.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: webcertificates-v11
type: Opaque
data:
  feeds.mais-h.eu.key: $(fetch feeds.mais-h.eu/privkey.pem)
  feeds.mais-h.eu.cert: $(fetch feeds.mais-h.eu/fullchain.pem)
  save.mais-h.eu.key: $(fetch save.mais-h.eu/privkey.pem)
  save.mais-h.eu.cert: $(fetch save.mais-h.eu/fullchain.pem)
  dckel.mais-h.eu.key: $(fetch dckel.mais-h.eu/privkey.pem)
  dckel.mais-h.eu.cert: $(fetch dckel.mais-h.eu/fullchain.pem)
  blog.mais-h.eu.key: $(fetch blog.mais-h.eu/privkey.pem)
  blog.mais-h.eu.cert: $(fetch blog.mais-h.eu/fullchain.pem)
  files.mais-h.eu.key: $(fetch files.mais-h.eu/privkey.pem)
  files.mais-h.eu.cert: $(fetch files.mais-h.eu/fullchain.pem)
  files.mais-h.eu.ca: $(cat ../files/certs/ca.crt | openssl enc -A -base64)
EOF
