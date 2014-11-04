define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  'topojson',
  'router' // Request router.js
], function ($, _, Backbone, d3, topojson) {

    //
    //VIEWS
    //The main wikiatlas view
    var atlas = Backbone.View.extend({

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

    //Define zoom behavior
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

    //Do this during any map click
    function clicked(d) {
        console.log(this);

        //Sets active class and trigger animation
        if (active.node() === this) return zoomExtents();
        active.classed("active", false);
        active = d3.select(this).classed("active", true).moveToFront();


        //Calculate translate and scale for the feature
        t = getTransform(d);
        svgMap.transition()
            .duration(750)
            .call(zoom.translate(t.translate).scale(t.scale).event);
    }

    //Do this during any map zoom
    function zoomed() {

        //Scale canvas styles on zoom
        svgMap.style("stroke-width", 1.5 / d3.event.scale + "px");
        svgMap.style("font-size", 1 / d3.event.scale + "em");
        svgMap.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

    }


    //Zoom to map extents
    function zoomExtents() {
        // If the drag behavior prevents the default click,
        // also stop propagation so we don’t click-to-zoom.
        active.classed("active", false);
        active = d3.select(null);

        d3.select(".mesh").moveToFront();

        //Calculate bounds
        b = path.bounds(d3.select(".outline").datum());
        s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
        console.log(b);

        //Animate zoom
        svgMap.transition()
            .duration(750)
            .call(zoom.translate(t).scale(s).event);
    }

    function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }

    return {
        Atlas: atlas
    };

});