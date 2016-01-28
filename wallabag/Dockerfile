FROM debian:jessie

RUN \
  apt-get -y update && \
  apt-get -y upgrade && \
  apt-get -y install curl php5-cli git php5-tidy php5-pgsql php5-curl php5-gd && \
  curl https://getcomposer.org/download/1.0.0-alpha11/composer.phar -o /usr/bin/composer && \
  chmod +x /usr/bin/composer && \
  apt-get clean

RUN git clone https://github.com/wallabag/wallabag.git -b 2.0.0-alpha.2 --depth 1 /wallabag

WORKDIR /wallabag

ADD auth.json /root/.composer/auth.json
RUN composer install

WORKDIR /wallabag

ADD parameters.yml /wallabag/app/config/parameters.yml

CMD composer run-script build-parameters && php bin/console server:run 0.0.0.0:80 --env=prod
