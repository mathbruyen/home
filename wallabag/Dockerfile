FROM alpine:3.4

RUN apk add --update --repository http://dl-3.alpinelinux.org/alpine/edge/testing \
  curl git php7 php7-phar php7-openssl \
  nginx \
  php7-fpm php7-cgi php7-session php7-ctype php7-dom php7-json php7-gd php7-mbstring php7-xml php7-tidy php7-curl php7-gettext php7-pgsql php7-pdo_pgsql php7-iconv && \
  rm -rf /var/cache/apk/*

RUN curl https://getcomposer.org/download/1.2.0/composer.phar -o /usr/bin/composer && chmod +x /usr/bin/composer

RUN git clone https://github.com/wallabag/wallabag.git -b 2.0.5 --depth 1 /wallabag

RUN ln -s /usr/bin/php7 /usr/bin/php

WORKDIR /wallabag

ADD auth.json /root/.composer/auth.json
RUN composer install --no-dev -o --no-scripts

WORKDIR /wallabag

ADD parameters.yml /wallabag/app/config/parameters.yml
ADD nginx.conf /etc/nginx/nginx.conf

ENV SYMFONY_ENV=prod
EXPOSE 80

CMD composer run-script post-cmd -- --no-interaction && chown -R nobody /wallabag/var && php-fpm7 && nginx -g "daemon off;"
