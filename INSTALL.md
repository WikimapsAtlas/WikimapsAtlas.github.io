Installation instructions on Ubuntu.

# Dependencies

Make, Curl, Unzip, [GDAL/OGR](https://www.mapbox.com/tilemill/docs/guides/gdal/)

    sudo apt-get install build-essential zip unzip gdal-bin

[Nodejs](http://howtonode.org/how-to-install-nodejs)

    sudo apt-get install g++ curl libssl-dev apache2-utils
    sudo apt-get install git-core
    git clone git://github.com/ry/node.git
    cd node
    ./configure
    make
    sudo make install

[TopoJSON](https://github.com/mbostock/topojson)

    npm install topojson

# Working with OSM data

See step 1 and 2 of [Mapbox OSM ubuntu quickstart](https://www.mapbox.com/tilemill/docs/guides/osm-bright-ubuntu-quickstart/) 

