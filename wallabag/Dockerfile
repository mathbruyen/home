FROM debian:jessie

RUN \
  apt-get -y update && \
  apt-get -y upgrade && \
  apt-get -y install curl php5-cli git php5-tidy php5-pgsql && \
  curl https://getcomposer.org/download/1.0.0-alpha11/composer.phar -o /usr/bin/composer && \
  chmod +x /usr/bin/composer && \
  git clone https://github.com/mathbruyen/wallabag.git -b smtp-from-env /wallabag && \
  apt-get clean

ADD parameters.yml /wallabag/app/config/parameters.yml
ADD auth.json /root/.composer/auth.json

WORKDIR /wallabag

RUN composer install

CMD composer run-script build-parameters && php app/console server:run 0.0.0.0:80
