// Wikimaps Atlas App
define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  'topojson',
  'router' // Request router.js
], function ($, _, Backbone, d3, topojson) {

    return {
        initialize: function () {

            //d3 extension
            //Render a d3 selection to the top of the SVG
            //http://tributary.io/tributary/3922684
            d3.selection.prototype.moveToFront = function () {
                return this.each(function () {
                    this.parentNode.appendChild(this);
                });
            };

            //Useful variables
            var ENTER_KEY = 13;
            var ESC_KEY = 27;

            var active = d3.select(null);
            var width, height;
            var svgMap, g;

            //Start the backbone router
            Backbone.history.start();

            console.log(topojson);
        }
    };

});