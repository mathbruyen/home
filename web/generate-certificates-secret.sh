#! /bin/bash

cat > web-certificates.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: webcertificates-v6
type: Opaque
data:
  feeds.mais-h.eu.key: $(sudo openssl enc -A -base64 -in /etc/letsencrypt/live/feeds.mais-h.eu/privkey.pem)
  feeds.mais-h.eu.cert: $(sudo openssl enc -A -base64 -in /etc/letsencrypt/live/feeds.mais-h.eu/fullchain.pem)
  save.mais-h.eu.key: $(sudo openssl enc -A -base64 -in /etc/letsencrypt/live/save.mais-h.eu/privkey.pem)
  save.mais-h.eu.cert: $(sudo openssl enc -A -base64 -in /etc/letsencrypt/live/save.mais-h.eu/fullchain.pem)
  dckel.mais-h.eu.key: $(sudo openssl enc -A -base64 -in /etc/letsencrypt/live/dckel.mais-h.eu/privkey.pem)
  dckel.mais-h.eu.cert: $(sudo openssl enc -A -base64 -in /etc/letsencrypt/live/dckel.mais-h.eu/fullchain.pem)
EOF
