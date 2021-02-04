
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // The data.features object is in the GeoJSON standard
  console.log(data.features);

  // This is it! Leaflet knows what to do with 
  // each type of feature (held in the `geometry` key) and draws the correct markers.
  // var earthquakes = L.geoJSON(data.features);

  var earthquakes = L.geoJSON(data.features, {
    onEachFeature: onEachFeatureFunc,
    pointToLayer: createCircles
  });

  // The rest of this is all the same
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite Map":satellitemap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);



// https://leafletjs.com/examples/geojson/
// L.geoJSON() also gives us handy options, almost like a built in `.forEach()`
// // Define a function we want to run once for each feature in the features array
// // Give each feature a popup describing the place and time of the earthquake
function onEachFeatureFunc(feature, layer) {
  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

function Color(d) {
  return d > 90
      ? "#94B408"
      : d > 70
          ? "#B4B108"
          : d > 50
              ? "#B47F08"
              : d > 30
                  ? "#B45608"
                  : d > 10
                      ? "#B42608"
                      : d <= 10
                          ? "#F92206"
                          : "#E8F906";
}

  //Function for creating circle markers
  function createCircles(feature, latlng) {
    //Parsing the data to integers
    feature.properties.mag = +feature.properties.mag;
    feature.geometry.coordinates[2] = +feature.geometry.coordinates[2];
    //Markers
    var geojsonMarkerOptions = {
      radius: feature.properties.mag * 2,
      fillColor: Color(feature.geometry.coordinates[2]),
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6
    };
    return L.circleMarker(latlng, geojsonMarkerOptions);
  }


function pointToLayerFunc(feature, latlng) {
  return L.circleMarker(latlng, geojsonMarkerOptions);
}

//Creating a legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [-10, 10, 30, 50, 70, 90],
    labels = ['<strong>Depth of earthquake (miles)</strong>'];
  for (var i = 0; i < grades.length; i++) {
    from = grades[i];
    to = grades[i + 1] - 1;
    labels.push(
      '<i style="background:' + Color(from + 1) + '"></i> ' +
      from + (to ? '&ndash;' + to : '+'));
  }
  div.innerHTML = labels.join('<br>');
  return div;
};
legend.addTo(myMap);
});

