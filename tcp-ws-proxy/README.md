# Websocket proxy for TCP connections

```
                  ----------                        ----------
? <-- tcp --> 123 | client | ? <-- websocket --> 80 | server | ? <-- tcp --> 456
                  ----------                        ----------
```

Authentication possible using client certificates:

```
                  ----------                         -----------------                        ----------
? <-- tcp --> 123 | client | ? <-- websocket --> 443 | ssl offloader | ? <-- websocket --> 80 | server | ? <-- tcp --> 456
                  ----------                         -----------------                        ----------
```

## Running

Using npm:

```
# Server
TARGET_URL=tcp://localhost:80 LISTEN_PORT=8081 npm run server

# Client with direct connection to server
TARGET_URL=http://localhost:8081 LISTEN_PORT=8080 npm run client

# Client with client certificate authentication
TARGET_URL=http://localhost:8081 LISTEN_PORT=8080 CERT_PATH=/certs/client.crt KEY_PATH=/certs/client.key npm run client
```

Using docker:

```
# Build image
docker build -t mathbruyen/tcp-ws-proxy:20160825 .

# Server
docker run --rm -e LISTEN_PORT=8080 -e TARGET_URL=tcp://target:80 -p 8080:8080 mathbruyen/tcp-ws-proxy:20160825 server

# Client with direct connection to server
docker run --rm -e LISTEN_PORT=8081 -e TARGET_URL=wss://proxyserver:8080 -p 8081:8081 mathbruyen/tcp-ws-proxy:20160825 client

# Client with client certificate authentication
docker run --rm -v $(pwd)/certs:/certs -e CERT_PATH=/certs/client.crt -e KEY_PATH=/certs/client.open.key -e LISTEN_PORT=8081 -e TARGET_URL=wss://ssloffloader:8080 -p 8081:8081 mathbruyen/tcp-ws-proxy:20160825 client
```

## Dev

Run tests with `npm test`. Test runner is [Mocha](https://mochajs.org/).

Main dependency is [websocket](https://www.npmjs.com/package/websocket) ([docs here](https://github.com/theturtle32/WebSocket-Node/tree/master/docs)). Each connection is assigned a UUID transmitted to the server through websocket protocol negotiation that allows correlating log entries.

## Client certificates

Certificate generation:

```
# Server key & certificate for signing clients
openssl genrsa -des3 -out ca.key 4096
openssl req -new -x509 -days 365 -key ca.key -out ca.crt

# Client key without passphrase & certificate request
openssl genrsa -des3 -out client.key 1024
openssl rsa -in client.key -out client.open.key
openssl req -new -key client.key -out client.csr

# Sign certificate request
openssl x509 -req -days 365 -in client.csr -CA ca.crt -CAkey ca.key -set_serial 01 -out client.crt
```

Nginx configuration for ssl offloader and client certificate checking:

```
server {
  listen 443 ssl http2;
  ssl_certificate /certs/server.crt;
  ssl_certificate_key /certs/server.key;
  ssl_client_certificate /certs/ca.crt;
  ssl_verify_client on;

  location / {
    proxy_pass http://proxyserver;
    proxy_set_header X-Client-Name $ssl_client_s_dn;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

Assuming nginx config is in `conf/site.conf`, certificates are in `certs`, server certificate was obtained in another way and matches link alias in `proxyclient` command.

```
# End server
docker run -d --name final nginx

# Proxy server
docker run -d --name proxyserver -e LISTEN_PORT=80 -e TARGET_URL=tcp://final:80 --link final mathbruyen/tcp-ws-proxy:20160825 server

# SSL offloader and client certificate checking
docker run -d --name ssl -v $(pwd)/certs:/test -v $(pwd)/conf:/etc/nginx/conf.d -p 443:443 --link proxyserver nginx

# Proxy client
# TARGET_URL and --link alias must match server certificate hostname
docker run -d --name proxyclient -v $(pwd)/certs:/certs -e CERT_PATH=/certs/client.crt -e KEY_PATH=/certs/client.open.key -e LISTEN_PORT=8080 -e TARGET_URL=wss://example.com -p 8080:8080 --link ssl:example.com mathbruyen/tcp-ws-proxy:20160825 client

# Testing the chain (displays nginx welcome page)
curl http://localhost:8080
```

