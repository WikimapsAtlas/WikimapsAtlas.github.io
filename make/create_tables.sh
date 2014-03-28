psql -U postgres -c "create database ne;"
psql -U postgres -d ne -f /usr/share/postgresql/9.1/contrib/postgis-1.5/postgis.sql
psql -U postgres -d ne -f /usr/share/postgresql/9.1/contrib/postgis-1.5/spatial_ref_sys.sql
