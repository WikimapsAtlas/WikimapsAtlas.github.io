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

            //Render everything
            this.render();

            //Update the map title
            this.on("change:mapLocation change:mapTheme", this.setMapTitle());

        },

        // Render the atlas
        render: function () {

            //Setup a new atlas view
            this.atlas = new wikiatlas.atlas();

        },

        //Sets the map title as "Theme" Map of "Location"
        setMapTitle: function () {
            this.set("mapTitle", this.get("mapTheme") + " Map Of " + this.get("mapLocation"));
        }

    });

    //VIEWS
    //The main wikiatlas view
    wikiatlas.atlas = Backbone.View.extend({

        // Target element
        el: '#wikiatlas',

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

            var projection = d3.geo.mercator()
                .center([82.7, 23])
                .scale(6000)
                .translate([this.width / 2, this.height / 2]); 

            var path = d3.geo.path()
                .projection(projection); 

            //Create empty SVG element
            var svg = d3.select("#wikiatlas-map").append("svg")
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