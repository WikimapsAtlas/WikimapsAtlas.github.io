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

//Wikiatlas API
var Wikiatlas = Backbone.View.extend({
    
    // BASE PROPERTIES
    // Target element
    el: '#wikiatlas',
    
    // Atlas title template
    title: _.template("<%=theme%> Map of <%=location%>"),

    // Constructor
    initialize: function (options) {

        //Extend default settings using custom options
        defaults = {
            date: "2014",
            location: "The World",
            theme: "Administrative",
            view: "Globe",
            width: 500,
            height: 600
        };
        this.properties = $.extend(defaults, options);

        this.render();
    },

    // Render the atlas
    render: function () {
        this.$el.append("Hello World");
    }
});






