FROM gliderlabs/alpine:3.2

RUN apk --update add postfix cyrus-sasl

ADD run.sh /run.sh

RUN chmod +x /run.sh

ENTRYPOINT ["/run.sh"]
