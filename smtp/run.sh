#! /bin/sh

# Generating configuration
postconf -e "smtp_sasl_auth_enable=yes"
postconf -e "smtp_sasl_password_maps=static:$MAILER_USER:$MAILER_PASSWORD"
postconf -e "smtp_sasl_security_options=noanonymous"
postconf -e "smtp_tls_security_level=encrypt"
postconf -e "header_size_limit=4096000"
postconf -e "relayhost=[$MAILER_HOST]:$MAILER_PORT"
postconf -e "mynetworks = 0.0.0.0/0 [::]/0"

# Starting server
postfix start

# Waiting for process to exit
sleep 5
pid=$(</var/spool/postfix/pid/master.pid)
while kill -0 "$pid"; do
  sleep 1
done
