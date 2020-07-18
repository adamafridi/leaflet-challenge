// Creating map object
var myMap = L.map("map", {
  center: [41.8781, -87.6298],
  zoom: 5,
});
// Adding tile layer
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY,
  }
).addTo(myMap);
// Use this link to get the geojson data.
var link =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";


// Function that will determine the color of the earthquake
function chooseColor(magnitude) {
  if (magnitude > 5) return "red";
  else if (magnitude > 4) return "orange";
  else if (magnitude > 3) return "yellow";
  else if (magnitude > 2) return "blue";
  else if (magnitude > 1) return "green";
  else return "purple";
}
// Grabbing our GeoJSON data..
d3.json(link, function (data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Style each feature
    style: function (feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our circles, based on magnitude.
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: 0.85,
        weight: 1.5,
        radius: feature.properties.mag * 3,
      };
    },
    // Called on each feature
    onEachFeature: function (feature, layer) {
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup(
        "<h1> Magnitude " +
          feature.properties.mag +
          "</h1> <hr> <h2>" +
          feature.properties.place +
          "</h2>"
      );
    },
  }).addTo(myMap);
  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var limits = ["1+", "2+", "3+", "4+", "5+"];
    var colors = ["green", "blue", "yellow", "orange", "red"];
    var labels = [];
    // Add min & max
    var legendInfo =
      "<h1>Magnitude</h1>" +
      '<div class="labels">' +
      '<div class="min">' +
      limits[0] +
      "</div>" +
      '<div class="max">' +
      limits[limits.length - 1] +
      "</div>" +
      "</div>";
    div.innerHTML = legendInfo;
    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>');
    });
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };
  // Adding legend to the map
  legend.addTo(myMap);
});
