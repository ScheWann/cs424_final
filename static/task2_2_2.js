let width = 800;
let height = 500;
let geoData;
let isZoomedIn = false;

// Initialize the Leaflet map
var mymap = L.map("task2_2_2").setView([41.8781, -87.6298], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(mymap);

let svg = d3
  .select(mymap.getPanes().overlayPane)
  .append("svg")
  .attr("pointer-events", "auto");

let g = svg.append("g").attr("class", "leaflet-zoom-hide");

function projectPoint(x, y) {
  var point = mymap.latLngToLayerPoint(new L.LatLng(y, x));
  this.stream.point(point.x, point.y);
}

var transform = d3.geoTransform({ point: projectPoint });
var path = d3.geoPath().projection(transform);

function update() {
  if (!geoData) return;

  path = d3.geoPath().projection(transform);

  var bounds = path.bounds(geoData),
    topLeft = bounds[0],
    bottomRight = bounds[1];

  svg
    .attr("width", bottomRight[0] - topLeft[0])
    .attr("height", bottomRight[1] - topLeft[1])
    .style("left", topLeft[0] + "px")
    .style("top", topLeft[1] + "px");

  g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

  g.selectAll(".dot")
    .attr("cx", function (d) {
      return mymap.latLngToLayerPoint([d.LATITUDE, d.LONGITUDE]).x;
    })
    .attr("cy", function (d) {
      return mymap.latLngToLayerPoint([d.LATITUDE, d.LONGITUDE]).y;
    });
}
mymap.on("moveend", update);

var projection = d3.geoMercator();
var path = d3.geoPath().projection(projection);

let tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

Promise.all([
  d3.json("/data/boundaries-zipcode.geojson"),
  d3.csv("/data/Chicago_community.csv"),
  d3.csv("/data/2023_withZip.csv"),
]).then(function ([loadedGeoData, communityData, countData]) {
  geoData = loadedGeoData;
  let zipPopulationObj = {};
  projection.fitSize([width, height], geoData);

  // convert community data to a object to color mapping
  communityData.forEach((item) => {
    zipPopulationObj[item.ZipCode] = item.Population;
  });

  // find each (x, y) in the map
  countData.forEach((d) => {
    let coords = projection([+d.LONGITUDE, +d.LATITUDE]);
    d.projectedX = coords[0];
    d.projectedY = coords[1];
  });

  // Function to get the color based on population
  function getColorForZip(zipCode) {
    return colorScale(zipPopulationObj[zipCode]);
  }

  let colorScale = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(communityData, (d) => d.Population)]);

  function onEachFeature(feature, layer) {
    layer.on({
      mouseover: function (e) {
        var zip = feature.properties.zip;
        var population = zipPopulationObj[zip] || 'No data';
        tooltip
          .html("Zip: " + zip + "<br>Population: " + population)
          .style("left", e.originalEvent.pageX + 5 + "px")
          .style("top", e.originalEvent.pageY - 5 + "px")
          .style("opacity", 1);
        e.target.setStyle({
          weight: 3,
          color: '#333',
          fillOpacity: 1
        });
      },
      mouseout: function (e) {
        var zip = feature.properties.zip;
        tooltip.style("opacity", 0);
        L.geoJSON(geoData, {style: style}).resetStyle(e.target);
      },
      click: function (e) {
        var bounds = e.target.getBounds();
        mymap.fitBounds(bounds);
        let clickedZip = feature.properties.zip;
        let districtClickedEvent = new CustomEvent("districtClicked", {
          detail: {
            zipCode: clickedZip
          }
        });
        window.dispatchEvent(districtClickedEvent);
      },
    });
  }

  function style(feature) {
    let zipCode = feature.properties.zip;
    let fillColor = getColorForZip(zipCode);
    return {
      fillColor: fillColor,
      weight: 1,
      color: "#333",
      opacity: 1,
      fillOpacity: 0.7,
    };
  }

  g.selectAll(".dot")
    .data(countData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => d.projectedX)
    .attr("cy", (d) => d.projectedY)
    .attr("r", 1.5)
    .style("fill", "red");

  L.geoJSON(geoData, {
    style: style,
    onEachFeature: onEachFeature,
  }).addTo(mymap);

  update();
});
