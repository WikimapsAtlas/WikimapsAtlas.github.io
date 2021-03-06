//Query wikidata to update language 0.5s after typing a language code
var timerid;
$("#lang").keyup(function () {
    clearTimeout(timerid);
    timerid = setTimeout(function () {
        lang = $("#lang").val();
        wd("labels", lang);
        $("#lang").addClass("disabled");
    }, 500);

    //Bind this keypress function to all of the input tags
    $("input").keypress(function (evt) {
        //Deterime where our character code is coming from within the event
        var charCode = evt.charCode || evt.keyCode;
        if (charCode == 13) { //Enter key's keycode
            return false;
        }
    });

});


//Load the map data
var width = 500,
    height = 600,
    centered; 
var projection = d3.geo.albers()
    .scale(50)
    .translate([width / 2, height / 2]); 
var projection = d3.geo.mercator()
    .center([82.7, 23])
    .scale(6000)
    .translate([width / 2, height / 2]); 
var path = d3.geo.path()
    .projection(projection); 
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("atlas/IND.adm0.topojson", function (error, india) {

    var indiamap = topojson.feature(india, india.objects.indiamap).features;

    //Change map language by taking a user input
    changeMapLanguage = function () {

    };

    //return wikidata key from shape
    wikidata = function (d) {
        return d.properties.wiki.toUpperCase();
    };

    //add wikidata id to data attribute from existing labels
    wdGet = function (lang) {

    };

    //Returns a label for a wikidata id and language code
    wdLabel = function (q, lang) {
        $.ajax({
            dataType: "json",
            url: "http://www.wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&ids=" + q + "&languages=" + lang + "&props=labels&format=json&callback=?",
        }).done(function (data) {
            for (var q in data.entities);
            return data.entities[q].labels[lang].value;
        });

    };

    //Change map language
    wd = function (props, lang) { 
        $("text[wiki], #map-overlay [wiki]").each(function () {
            q = this.getAttribute("wiki");
            $.ajax({
                dataType: "json",
                url: "http://www.wikidata.org/w/api.php?action=wbgetentities&ids=" + q + "&languages=" + lang + "&props=" + props + "&format=json&callback=?",
            }).done(function (data) {
                for (var q in data.entities)
                    label = data.entities[q].labels[lang].value;
                //if(props=="labels")
                $("svg text[wiki='" + q + "']")[0].textContent = label;
                //console.log(label);
                //console.log($("#map-overlay [wiki]"));

            });
        }); 
    };

    //focus state
    clickState = function (d) {
        $("table tbody tr").slideUp();
        var stateName = $("text[wiki='" + wikidata(d) + "']")[0].textContent;
        $("tbody tr a:contains('" + stateName + "')").parent().parent().slideDown();
        d3.selectAll("svg text").classed("focus", false);
        d3.selectAll("svg path").classed("focus", false);
        d3.selectAll("[wiki='" + wikidata(d) + "']").classed("focus", true);
    };  

    //create state paths
    svg.selectAll(".subunit")
        .data(topojson.feature(india, india.objects.indiamap).features)
        .enter().append("path")
        .attr("wiki", function (d) {
            return wikidata(d);
        })
        .attr("d", path)

    //-interactions
    //-click path navigator
    .on("click", clickState)
        .on("mouseover", function (d, i) {
            d3.selectAll("path").classed("active", false);
            d3.selectAll("text[wiki='" + wikidata(d) + "']").classed("active", true);
            d3.select("text[wiki='" + wikidata(d) + "']").transition().styleTween("font-size", function () {
                return d3.interpolate("100%", "150%");
            });
        })
        .on("mouseout", function (d, i) {
            d3.selectAll("text").classed("active", false);
            d3.select("text[wiki='" + wikidata(d) + "']").transition().styleTween("font-size", function () {
                return d3.interpolate("150%", "100%");
            });
        }); 

    //text labels: create for all states
    svg.selectAll("text")
        .data(topojson.feature(india, india.objects.indiamap).features)
        .enter()
        .append("text")
        .attr("transform", function (d) {
            return "translate(" + path.centroid(d) + ")";
        })
        .attr("class", function (d) {
            return d.properties.ENGTYPE_1
        })
        .attr("wiki", function (d) {
            return wikidata(d);
        })
        .text(function (d) {})

    //-interactions
    //-click text map navigator
    .on("click", clickState)
    //-highlight corresponding state path
    .on("mouseover", function (d, i) {
        d3.selectAll("text").classed("active", false);
        d3.selectAll("path[wiki='" + wikidata(d) + "']").classed("active", true);
    })
    //-dim all state paths
    .on("mouseout", function (d, i) {
        d3.selectAll("path[wiki='" + wikidata(d) + "']").classed("active", false);
    });

    wd("labels", "en");
    //Legend teaser
    $('.subheader span').hover(
        function () {
            $('svg .' + $(this).attr('class')).attr('class', 'active')
        },
        function () {
            $('svg .active').removeAttr('class', 'active')
        }
    ); 

    //Railways layer
    /*
d3.json("img/indiarail.json", function(error, rail) {
  console.log(rail)

  var indiarail=topojson.feature(rail, rail.objects.indiarail).features;
  svg.selectAll(".rail")
.data(indiarail)
.enter().append("path")
.attr("d", path)
.attr("class", "rail");

});
*/

});