FROM alpine:3.2

ADD sshd_config /etc/ssh/sshd_config
ADD id_rsa.pub /etc/ssh/root/authorized_keys

RUN \
  apk -Uuv add curl bash python openssh && \
  curl https://dl.google.com/dl/cloudsdk/channels/rapid/google-cloud-sdk.tar.gz -o /root/google-cloud-sdk.tar.gz && \
  curl https://circle-artifacts.com/gh/andyshinn/alpine-pkg-glibc/8/artifacts/0/home/ubuntu/alpine-pkg-glibc/packages/x86_64/glibc-2.21-r2.apk -o /root/glibc.apk && \
  apk -U add --allow-untrusted /root/glibc.apk && \
  tar -xzvf /root/google-cloud-sdk.tar.gz -C /root && \
  rm /root/google-cloud-sdk.tar.gz && \
  env CLOUDSDK_CORE_DISABLE_PROMPTS=1 /root/google-cloud-sdk/install.sh && \
  rm /var/cache/apk/*

CMD /usr/bin/ssh-keygen -A && /usr/sbin/sshd -D -f /etc/ssh/sshd_config
