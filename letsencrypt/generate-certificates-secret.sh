#! /bin/bash

function fetch {
  kubectl exec letsencrypt-rtki2 -c letsencrypt -- sh -c "sleep 1 && cat /etc/letsencrypt/live/$1" | openssl enc -A -base64
}

cat > web-certificates.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: webcertificates-v7
type: Opaque
data:
  feeds.mais-h.eu.key: $(fetch feeds.mais-h.eu/privkey.pem)
  feeds.mais-h.eu.cert: $(fetch feeds.mais-h.eu/fullchain.pem)
  save.mais-h.eu.key: $(fetch save.mais-h.eu/privkey.pem)
  save.mais-h.eu.cert: $(fetch save.mais-h.eu/fullchain.pem)
  dckel.mais-h.eu.key: $(fetch dckel.mais-h.eu/privkey.pem)
  dckel.mais-h.eu.cert: $(fetch dckel.mais-h.eu/fullchain.pem)
EOF
