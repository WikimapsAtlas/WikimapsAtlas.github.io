/*
 * Wikimaps Atlas
 *
 * Copyright (C) 2014 Arun Ganesh, Hugo Lopez
 *
 * Wikimaps Atlas is dual licensed GPLv2 or later and MIT. You don't
 * have to do anything special to choose one license or the other and you don't
 * have to notify anyone which license you are using. You are free to use
 * UniversalLanguageSelector in commercial projects as long as the copyright
 * header is left intact. See files GPL-LICENSE and MIT-LICENSE for details.
 *
 */

//Global app backbone
var wikiatlas = wikiatlas || {};

//Other variables
var ENTER_KEY = 13;
var ESC_KEY = 27;

(function () {

    var active = d3.select(null);
    var width, height;
    var svgMap, g;


    //MODELS
    //Wikiatlas Model
    //Map constructor
    wikiatlas.Map = Backbone.Model.extend({

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
                    console.log(this);
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




    //
    //VIEWS
    //The main wikiatlas view
    wikiatlas.Atlas = Backbone.View.extend({

        // Target element
        el: '#wikiatlas',

        //Interacts with the map model
        model: wikiatlas.Map,

        // Delegated events for user input in search bar
        events: {
            'keypress #wikiatlas-search': 'searchForMap'
        },

        // Inititalize atlas by 
        initialize: function () {

            this.createD3SVG();

            //Cache UI objects
            this.$mapSearch = this.$('#wikiatlas-search');
            this.$mapTitle = this.$('#wikiatlas-title');
            this.$mapSVG = this.$("#wikiatlas-map");
            this.$mapFeatureList = this.$("#wikiatlas-features");

        },

        //Create empty SVG for d3
        createD3SVG: function () {

            //Sets width and height for container based on the screen
            this.width = this.$el.width();
            this.height = this.width * 0.404;
            width = this.width;
            height = this.height;

            //Create empty SVG element
            svgMap = d3.select("#wikiatlas-map").append("svg")
                .attr("width", this.width)
                .attr("height", this.height)
                .on("click", stopped, true);

            svgMap.append("rect")
                .attr("class", "background")
                .attr("width", this.width)
                .attr("height", this.height)
                .on("click", zoomExtents);

            g = svgMap.append("g").attr("class", "canvas");
            svgMap = g;

        },

        //Search for map from user input
        searchForMap: function (e) {
            if (e.which === ENTER_KEY && this.$input.val().trim()) {
                app.todos.create(this.newAttributes());
                this.$input.val('');
            }
        },

        //Sets the item as the active object
        setActiveFeature: function (d) {
            this.model.set("activeId", d.id);
            console.log(this);
            clicked(d);
        }


    });

    //The map view
    wikiatlas.svgMap = Backbone.View.extend({

        // Target element
        el: '#wikiatlas-map svg',
        template: _.template("<%= mapTitle %><small><%= mapDate %></small>")

    });

    //D3 click and zoom animation
    //http://bl.ocks.org/mbostock/9656675

    //Zoom behaviour
    var zoom = d3.behavior.zoom()
        .translate([0, 0])
        .scale(1)
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

    //Returns transformation parameters for a feature
    function getTransform(d) {
        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2;
        var t = {};
        t.scale = .9 / Math.max(dx / width, dy / height);
        t.translate = [width / 2 - t.scale * x, height / 2 - t.scale * y];

        return t;
    }

    //Sets active class and trigger animation
    function clicked(d) {
        console.log(this);
        if (active.node() === this) return zoomExtents();
        active.classed("active", false);
        active = d3.select(this).classed("active", true).moveToFront();


        //Calculate translate and scale for the feature
        t = getTransform(d);
        svgMap.transition()
            .duration(750)
            .call(zoom.translate(t.translate).scale(t.scale).event);
    }

    //Scale canvas styles on zoom
    function zoomed() {
        
        svgMap.style("stroke-width", 1.5 / d3.event.scale + "px");
        svgMap.style("font-size", 1 / d3.event.scale + "em");
        svgMap.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    // If the drag behavior prevents the default click,
    // also stop propagation so we don’t click-to-zoom.
    function zoomExtents() {
        active.classed("active", false);
        active = d3.select(null);
        d3.select(".mesh").moveToFront();

        b = path.bounds(d3.select(".outline").datum());
        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
        console.log(b);

        svgMap.transition()
            .duration(750)
            .call(zoom.translate(t).scale(s).event);
    }

    function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }

    //Move a d3 selection to the top of the svg dom for rendering
    //http://tributary.io/tributary/3922684
    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };



})();