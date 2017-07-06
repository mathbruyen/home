#! /bin/bash

POD=$(kubectl get pods --selector app=letsencrypt -o jsonpath='{.items[0].metadata.name}')

function fetch {
  kubectl exec $POD -c letsencrypt -- sh -c "cat /etc/letsencrypt/live/$1" | openssl enc -A -base64
}

echo Using $POD

cat > web-certificates.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: webcertificates-v17
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
  gitlab.mais-h.eu.key: $(fetch gitlab.mais-h.eu/privkey.pem)
  gitlab.mais-h.eu.cert: $(fetch gitlab.mais-h.eu/fullchain.pem)
EOF
