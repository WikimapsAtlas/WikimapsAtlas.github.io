// Wikimaps Atlas JS Master File
// Author: Arun Ganesh <arun.planemad@gmail.com>

// Written using Asynchronous Module Definition (AMD) and Backbone
// https://github.com/amdjs/amdjs-api/wiki/AMD
// Based on https://github.com/dzejkej/modular-backbone/blob/master/

// Third party dependency configuration
require.config({
    paths: {
        jquery: 'libs/jquery/jquery-min',
        underscore: 'libs/underscore/underscore-min',
        backbone: 'libs/backbone/backbone-min',
        d3: 'libs/d3/d3.min',
        topojson: 'libs/d3/topojson',
        demoscript: 'libs/demoscript',
        templates: '../templates'
    },
    shim: {
        "topojson": {
            deps: ["d3"]
        },
        "demoscript": {
            deps: ["jquery"]
        }
    }
});

// Load our app module and pass it to our definition function
require([
  'app'
], function (app) {
    // Initialize the app once loaded
    app.initialize();
});