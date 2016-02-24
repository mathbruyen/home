FROM alpine:3.3

RUN apk add --update --repository http://dl-3.alpinelinux.org/alpine/edge/testing \
  curl git php7 php7-phar php7-openssl \
  nginx \
  php7-fpm php7-cgi php7-session php7-ctype php7-dom php7-json php7-gd php7-mbstring php7-xml php7-tidy php7-curl php7-gettext php7-pgsql php7-pdo_pgsql && \
  rm -rf /var/cache/apk/*

RUN curl https://getcomposer.org/download/1.0.0-alpha11/composer.phar -o /usr/bin/composer && chmod +x /usr/bin/composer

RUN git clone https://github.com/wallabag/wallabag.git -b 2.0.0-alpha.2 --depth 1 /wallabag

RUN ln -s /usr/bin/php7 /usr/bin/php

WORKDIR /wallabag

ADD auth.json /root/.composer/auth.json
RUN composer install --no-scripts

WORKDIR /wallabag

ADD parameters.yml /wallabag/app/config/parameters.yml

EXPOSE 80

CMD composer run-script build-parameters -- --no-interaction && php bin/console server:run 0.0.0.0:80 --env=prod
