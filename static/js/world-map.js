/*
*   Interactive World map with Admin0 bounding boxes
*
*   Source by Jason Davies http://www.jasondavies.com/maps/bounds/
*   Modified by Hugo Lopez
*/

$( document ).ready(function() {
    
//START> CONTEXT (background)
var width = 500,
    height = width;

var projection = d3.geo.orthographic()
    .translate([width / 2, height / 2])
    .scale(240)
    .clipAngle(90)
    .precision(.1)
    .rotate([0, -30]);
    // There is a clipping bug, fixed in branch geo-clip-good
    //.rotate([-103.5, -20, 0]);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule()();

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.drag()
      .origin(function() { var rotate = projection.rotate(); return {x: 2 * rotate[0], y: -2 * rotate[1]}; })
      .on("drag", function() {
        projection.rotate([d3.event.x / 2, -d3.event.y / 2, projection.rotate()[2]]);
        svg.selectAll("path").attr("d", path);
      }));

var hatch = svg.append("defs").append("pattern")
    .attr("id", "hatch")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 8)
    .attr("height", 8)
  .append("g");
hatch.append("path").attr("d", "M0,0L8,8");
hatch.append("path").attr("d", "M8,0L0,8");

svg.append("path")
    .datum({type: "Sphere"})
    .attr("class", "background")
    .attr("d", path);

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

svg.append("path")
    .datum({type: "LineString", coordinates: [[180, -90], [180, 0], [180, 90]]})
    .attr("class", "antimeridian")
    .attr("d", path);

svg.append("path")
    .datum({type: "Sphere"})
    .attr("class", "graticule")
    .attr("d", path);
//END> CONTEXT (background)

// FUNCTION: Get countries data & D3 project!
d3.json("static/data/world-110m.json", function(error, world) {
  //Create item & access to item's data
  var country = svg.selectAll(".country")
      .data(topojson.feature(world, world.objects.countries).features)
    .enter().append("g")
      .attr("class", "country");
  // Countries' shape
  country.append("path")
      .attr("class", "land")
      .attr("d", path);
  // Bounding boxes
  country.append("path")
      .datum(boundsPolygon(d3.geo.bounds)) // FIRED HERE !
      .attr("class", "bounds")
      .attr("d", path);
});

// Bounding boxe function !
function boundsPolygon(b) {
  return function(geometry) {
    var bounds = b(geometry);
  // START WNES JSON GENERATOR ! #########################################################################################
    var WNES = {}; // MUST declare object var ... = {};
      WNES.id = geometry.id, // ...then add properties successfully!
      // borders' geo-coordinates (decimal degrees)
      WNES.W = bounds[0][0], // Note: D3js is WSEN based.
      WNES.N = bounds[1][1],
      WNES.E = bounds[1][0],
      WNES.S = bounds[0][1],
      // frame's geo-dimensions (decimal degrees)
      WNES.geo_width = (WNES.E - WNES.W), 
      WNES.geo_height= (WNES.N - WNES.S), 
      // center geo-coordinates
      WNES.lat_center = (WNES.S + WNES.N)/2, 
      WNES.lon_center = (WNES.W + WNES.E)/2;
    // add a 5% padding on all WNES sides
    var WNESplus = {};
      WNESplus.W = WNES.W - WNES.geo_width  * 0.05, 
      WNESplus.N = WNES.N + WNES.geo_height * 0.05,
      WNESplus.E = WNES.E + WNES.geo_width  * 0.05,  
      WNESplus.S = WNES.S - WNES.geo_height * 0.05,
      // frame+paddings' (decimal degrees)
      WNESplus.geo_width = (WNESplus.E - WNESplus.W),
      WNESplus.geo_height= (WNESplus.N - WNESplus.S);

    //Degree of precision to keep 4 meaningful digits, ie: 108⁰7 OR 0⁰05'44"6.
    var geo_side_max = Math.abs( Math.max( WNES.geo_width, WNES.geo_height) );
    if      ( geo_side_max < 1000 && geo_side_max >= 100   ) { digits = 1; }
    else if ( geo_side_max < 100  && geo_side_max >= 10    ) { digits = 2; }
    else if ( geo_side_max < 10   && geo_side_max >= 1     ) { digits = 3; }
    else if ( geo_side_max < 1    && geo_side_max >= 0.1   ) { digits = 4; }
    else if ( geo_side_max < 0.1  && geo_side_max >= 0.01  ) { digits = 5; }
    else if ( geo_side_max < 0.01  && geo_side_max >= 0.001) { digits = 6; }
    else if ( geo_side_max < 0.001 && geo_side_max >= 0.0001){ digits = 7; };

    //PRINT RESULTS (4 meaningful digits): 
    console.log('Bound WNES: "'+ WNES.id +'":{ '
      + '"item":  { "name":"'+ WNES.id +'", "lat_center":'+ WNES.lat_center.toFixed(digits) + ',"lon_center":'+ WNES.lon_center.toFixed(digits) + '},'
      + '"WNES":  { "W":'+  WNES.W.toFixed(digits)     +',"N":' + WNES.N.toFixed(digits)     +',"E":' + WNES.E.toFixed(digits)     +',"S":' + WNES.S.toFixed(digits)     +',"geo_width":' + WNES.geo_width.toFixed(digits)     +',"geo_height":' + WNES.geo_height.toFixed(digits) +'},'
      + '"WNES+": { "W+":'+ WNESplus.W.toFixed(digits) +',"N+":'+ WNESplus.N.toFixed(digits) +',"E+":'+ WNESplus.E.toFixed(digits) +',"S+":'+ WNESplus.S.toFixed(digits) +',"geo_width+":'+ WNESplus.geo_width.toFixed(digits) +',"geo_height+":'+ WNESplus.geo_height.toFixed(digits) +'}'
      + '},');
  // END WNES JSON #########################################################################################################

    if (bounds[0][0] === -180 && bounds[0][1] === -90 && bounds[1][0] === 180 && bounds[1][1] === 90) {
      return {type: "Sphere"};
    }
    if (bounds[0][1] === -90) bounds[0][1] += 1e-6;
    if (bounds[1][1] === 90) bounds[0][1] -= 1e-6;
    if (bounds[0][1] === bounds[1][1]) bounds[1][1] += 1e-6;

    return {
      type: "Polygon",
      coordinates: [
        [bounds[0]]
          .concat(parallel(bounds[1][1], bounds[0][0], bounds[1][0]))
          .concat(parallel(bounds[0][1], bounds[0][0], bounds[1][0]).reverse())
      ]
    };
  };
}

function parallel(φ, λ0, λ1) {
  if (λ0 > λ1) λ1 += 360;
  var dλ = λ1 - λ0,
      step = dλ / Math.ceil(dλ);
  return d3.range(λ0, λ1 + .5 * step, step).map(function(λ) { return [normalise(λ), φ]; });
}

function normalise(x) {
  return (x + 180) % 360 - 180;
}
    
});