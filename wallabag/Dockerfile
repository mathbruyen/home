FROM alpine:3.4

RUN apk add --update --repository http://nl.alpinelinux.org/alpine/edge/community \
  curl git php7 php7-phar php7-openssl \
  nginx \
  php7-fpm php7-cgi php7-session php7-ctype php7-dom php7-json php7-gd php7-mbstring php7-xml php7-tidy php7-curl php7-gettext php7-pgsql php7-pdo_pgsql php7-iconv && \
  rm -rf /var/cache/apk/*

RUN ln -s /usr/bin/php7 /usr/bin/php

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
  php -r "if (hash_file('SHA384', 'composer-setup.php') === 'e115a8dc7871f15d853148a7fbac7da27d6c0030b848d9b3dc09e2a0388afed865e6a3d6b3c0fad45c48e2b5fc1196ae') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" && \
  php composer-setup.php --install-dir=/usr/bin --filename=composer --version=1.2.1 && \
  php -r "unlink('composer-setup.php');"
 
RUN git clone https://github.com/wallabag/wallabag.git -b 2.0.8 --depth 1 /wallabag

WORKDIR /wallabag

ADD auth.json /root/.composer/auth.json
RUN composer install --no-dev -o --no-scripts

WORKDIR /wallabag

ADD parameters.yml /wallabag/app/config/parameters.yml
ADD nginx.conf /etc/nginx/nginx.conf

ENV SYMFONY_ENV=prod
EXPOSE 80

CMD composer run-script post-cmd -- --no-interaction && chown -R nobody /wallabag/var && php-fpm7 && nginx -g "daemon off;"
