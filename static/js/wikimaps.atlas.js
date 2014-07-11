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
            this.on("change:mapLocation change:mapTheme", this.setMapTitle());

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
        loadMapData: function () {

            context = this;

            //Define the callback function to execute after the json is loaded
            var cb = function (error, topology) {
                
                //Convert from topojson to geojson
                featureSelector = context.get("mapsetID");
                topologyObjects = topology.objects[context.attributes.mapsetID];
                mapData = topojson.feature(topology, topologyObjects).features;
                console.log(mapData);

                //Projection to use
                projection = d3.geo.mercator()
                    .center([82.7, 23])
                    .scale(500)
                    .translate([context.atlas.width / 2, context.atlas.height / 2]); 

                //Path generator
                path = d3.geo.path()
                    .projection(projection); 

                //Create paths
                var map = context.atlas.D3SVG.selectAll("path")
                    .data(mapData)
                    .enter().append("path")
                    .attr("d", path);

            }
            return cb;

        },

        //Draws the d3 map
        drawMap: function () {

            mapsetLocation = "../../atlas/" + this.get("mapsetID") + ".topojson";
            d3.json(mapsetLocation, this.loadMapData());
            //d3.json("../../atlas/indiamapjk.json", loadMapData(this));
        }

    });

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

            //Create empty SVG element
            this.D3SVG = d3.select("#wikiatlas-map").append("svg")
                .attr("width", this.width)
                .attr("height", this.height);

        },

        //Search for map from user input
        searchForMap: function (e) {
            if (e.which === ENTER_KEY && this.$input.val().trim()) {
                app.todos.create(this.newAttributes());
                this.$input.val('');
            }
        },

    });

    wikiatlas.$mapTitle = Backbone.View.extend({

        // Target element
        el: '#wikiatlas-title',
        template: _.template("<%= mapTitle %><small><%= mapDate %></small>")


    });




})();