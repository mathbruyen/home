# Migrate Postgres from minor to minor

## Procedure

Postgres requires a [manual migration](http://docs.postgresqlfr.org/9.0/migration.html) when increasing minor version. This is done through a [Kubernetes job](http://kubernetes.io/docs/user-guide/jobs/). Since databases are using a persistent disk, only one pod can mount it at a given time. Thus the existing database must be shut down before migration (this also prevents any new write) and both old and new versions of Postgres must run as containers in the same pod.

* set versions, folders and environment in migration job
* set new versions in database pod
* stop the existing database pod
* start the migration job
* start the new pod
* trigger cleanup script

## Local testing

To migrate data from folder `data-9.4` to `data-9.5`:

```shell
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_USER=wallabag --name wallabagdb -v $(pwd)/data-9.4:/var/lib/postgresql/data -d postgres:9.4
docker run -e POSTGRES_PASSWORD=password -e POSTGRES_USER=wallabag -e PGPORT=10000 --name wallabagdb95 -v $(pwd)/data-9.5:/var/lib/postgresql/data -d postgres:9.5

docker exec -it wallabagdb psql -U wallabag # and set some data!

docker run -e POSTGRES_PASSWORD=password -e POSTGRES_USER=wallabag --name dump-load --link wallabagdb95 --link wallabagdb --rm postgres:9.5 sh -c "date && echo *:*:*:*:password > ~/.pgpass && chmod 0600 ~/.pgpass && pg_dumpall -h wallabagdb -U wallabag -p 5432 | psql wallabag -h wallabagdb95 -U wallabag -p 10000 && echo Done"
```
