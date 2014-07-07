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


var wikiatlas = {};

//Wikiatlas Model
wikiatlas.Map = Backbone.Model.extend({

    //Extend default settings using custom options
    defaults: {
        mapDate: "2014",
        mapLocation: "The World",
        mapsetID: "W0",
        mapTheme: "Administrative",
        view: "Globe",
        EPSG: "3857",
        width: 500,
        height: 600
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

        this.setAtlasDimesnions();
        this.setD3Svg();

    },

    //Sets the map title as "Theme" Map of "Location"
    setMapTitle: function () {
        this.set("mapTitle", this.get("mapTheme") + " Map Of " + this.get("mapLocation"));
    },

    //Sets width and height for container based on the screen
    setAtlasDimesnions: function () {
        $el = $("#wikiatlas");
        this.set("width", $el.width());
        this.set("height", $el.width() * 0.707);
    },

    //Sets up the d3 svg element for the views
    setD3Svg : function () {

        //Load the map data

        //var projection = d3.geo.albers()
        //    .scale(50)
        //    .translate([width / 2, height / 2]); 
        var projection = d3.geo.mercator()
            .center([82.7, 23])
            .scale(6000)
            .translate([this.width / 2, this.height / 2]); 

        var path = d3.geo.path()
            .projection(projection); 

        var svg = d3.select("#wikiatlas-map").append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
    }

});

wikiatlas.$mapTitle = Backbone.View.extend({

    // Target element
    el: '#wikiatlas-title',
    template: _.template("<%= mapTitle %><small><%= mapDate %></small>")


});

wikiatlas.$mapSearch = Backbone.View.extend({

    // Targer element
    el: '#wikiatlas-search'

});