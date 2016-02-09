FROM alpine:3.2

ADD sshd_config /etc/ssh/sshd_config
ADD id_rsa.pub /etc/ssh/root/authorized_keys

# Symlink sftp-server (required for Sublime SFTP plugin)
RUN \
  apk -Uuv add curl bash openssh && \
  apk -U add --allow-untrusted /root/glibc.apk && \
  ln -s /usr/lib/ssh/sftp-server /usr/bin/sftp-server && \
  rm /var/cache/apk/*

CMD /usr/bin/ssh-keygen -A && /usr/sbin/sshd -D -f /etc/ssh/sshd_config
