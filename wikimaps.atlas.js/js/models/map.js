define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  'topojson',
  'router' // Request router.js
], function ($, _, Backbone, d3, topojson) {

    //MODELS
    //Wikiatlas Model
    //Map constructor
    var map = Backbone.Model.extend({

        //Extend default settings using custom options
        defaults: {
            mapDate: "2014",
            mapLocation: "The World",
            mapsetID: "W0",
            mapTheme: "Administrative",
            view: "Globe",
            EPSG: "3857"
        },

        // Constructor
        initialize: function () {

            //Setup a new atlas view
            this.atlas = new wikiatlas.Atlas();

            //Render everything
            this.render();

            //Update the map title
            this.on("change:mapsetID change:mapLocation change:mapTheme", this.setMapTitle());

        },

        // Add a 
        addMapLayer: function () {

        },

        // Render the atlas
        render: function () {

            //this.findMap();
            this.drawMap();
            //this.loadFeatureList();

        },

        //Sets the map title as "Theme" Map of "Location"
        setMapTitle: function () {
            this.set("mapTitle", this.get("mapTheme") + " Map Of " + this.get("mapLocation"));
        },

        //Loads the requested mapset file and adds it to the svg
        //TODO: Probably not the best way to do it
        loadMapData: function () {

            context = this;
            //Define the callback function to execute after the json is loaded
            var cb = function (error, topology) {
                context.renderMapData(topology);
            }
            return cb;

        },

        //Render the loaded topology data using d3
        renderMapData: function (topology) {

            //Convert from topojson to geojson
            console.log(topology);
            featureSelector = this.get("mapsetID");
            topologyFeatures = topology.objects[featureSelector];
            mapData = topojson.feature(topology, topologyFeatures).features;

            //Loads the topology data into the map object and render the map
            this.set("mapFeatures", topologyFeatures);

            //Projection to use
            projection = d3.geo.mercator();

            //Path generator
            path = d3.geo.path()
                .projection(projection); 

            //Create paths for features
            svgMap.append("g")
                .attr("class", "features")
                .selectAll("path")
                .data(mapData)
                .enter().append("path")
                .attr("d", path)
                .attr("data-id", function (d) {
                    return d.id;
                })
                .attr("class", "feature")
                .on("click", clicked);

            //Create a mesh of all interior features
            svgMap.append("path")
                .datum(topojson.mesh(topology, topologyFeatures, function (a, b) {
                    return a !== b;
                }))
                .attr("class", "mesh")
                .attr("d", path);


            //Create an outline of merged features
            svgMap.append("path")
                .datum(topojson.merge(topology, topologyFeatures.geometries))
                .attr("class", "outline")
                .attr("d", path);

            //Generate group of text labels from name
            svgMap.append("g")
                .attr("class", "labels")
                .selectAll("text")
                .data(mapData)
                .enter()
                .append("text")
                .attr("transform", function (d) {
                    return "translate(" + path.centroid(d) + ")";
                })
                .attr("data-id", function (d) {
                    return d.id;
                })
                .attr("class", function (d) {
                    return d.properties.type_en;
                })
                .text(function (d) {
                    return d.properties.name;
                })
                .on("click", function (d) {
                    //this.set("activeFeature",d.id);
                    console.log("test" + this);
                    this.atlas.setActiveFeature(d);
                });

            //Reset the zoom to outline
            zoomExtents();

        },

        //Draws the d3 map
        drawMap: function () {

            mapsetLocation = "../../atlas/" + this.get("mapsetID") + ".topojson";
            d3.json(mapsetLocation, this.loadMapData());
            //d3.json("../../atlas/indiamapjk.json", loadMapData(this));
        }

    });

    return {
        Map: map
    };

});