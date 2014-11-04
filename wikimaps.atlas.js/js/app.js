// Wikimaps Atlas Apps
define([
  'jquery',
  'underscore',
  'backbone',
  'd3',
  'topojson',
  'router' // Request router.js
], function ($, _, Backbone, d3, topojson) {
    
    
    return {
        initialize: function() {
            Backbone.history.start();
            
            console.log(topojson);
        }
    };
    
});