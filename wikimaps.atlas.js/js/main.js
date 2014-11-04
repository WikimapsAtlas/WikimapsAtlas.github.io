// Wikimaps Atlas JS Master File
// Author: Arun Ganesh <arun.planemad@gmail.com>

// Configure requirejs for third party dependencies
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

// Dependency modules
require([
  // Load our app module and pass it to our definition function
  'app',

], function (App) {
    // The "app" dependency is passed in as "App"
    // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
    App.initialize();
});