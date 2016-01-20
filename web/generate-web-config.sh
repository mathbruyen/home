#! /bin/bash

cat > web-configuration.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: webconfiguration-v5
type: Opaque
data:
  ttrss.conf: $(openssl enc -A -base64 -in conf/ttrss.conf)
  wallabag.conf: $(openssl enc -A -base64 -in conf/wallabag.conf)
  dckel.conf: $(openssl enc -A -base64 -in conf/dckel.conf)
EOF
