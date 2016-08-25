FROM node:6.4.0

WORKDIR /proxy
COPY package.json /proxy/
RUN npm install

COPY /src /proxy/src

ENTRYPOINT ["npm", "run"]
