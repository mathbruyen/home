# Files backup

[Rsync](https://rsync.samba.org/) daemon waiting behind a [tcp over websocket proxy](../tcp-ws-proxy/). Authentication using client certificate managed at web layer.

Setup:

* generate server certificate ([doc](../tcp-ws-proxy/))
* start service and controller
* generate client certificates and sign them using server key

## Client

```
docker run --rm -it --name proxyclient -v $(pwd)/certs:/certs -e LISTEN_PORT=873 -e TARGET_URL=wss://files.mais-h.eu -e KEY_PATH=/certs/client.open.key -e CERT_PATH=/certs/client.crt -p 873:873 mathbruyen/tcp-ws-proxy:20160825 client
docker run --rm -it --link proxyclient -v $(pwd)/../blog:/test --entrypoint rsync mathbruyen/rsync:20160826-2 -rvP /test/ rsync://proxyclient/volume/
```
