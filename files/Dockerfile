FROM alpine:3.4

RUN apk add --update rsync && \
  rm -rf /var/cache/apk/*

VOLUME /data

ADD rsyncd.conf /etc/rsyncd.conf

ENTRYPOINT ["/usr/bin/rsync"]
CMD ["--no-detach", "--daemon", "--config", "/etc/rsyncd.conf"]
