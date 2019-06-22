
var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

// Base map
var myMap = L.map("mapid", { 
  center: [
    51.508, -0.11
  ],
  zoom: 2.5
});

//adds layer to map.
lightMap.addTo(myMap);

// call the json data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  //function to create plot style (radius makes it a circle based on the magnitude)
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Assign color depending on magnitude.
  function getColor(mag) {
    switch (true) {
    case mag > 5:
      return "#FF0000";
    case mag > 4:
      return "#ff9933";
    case mag > 3:
      return "#ffcc00";
    case mag > 2:
      return "#ccff33";
    case mag > 1:
      return "#d4ee00";
    default:
      return "#98ee00";
    }
  }

 //Assign radius based on the magnitude of earthquake
  function getRadius(mag) {
    if (mag === 0) {
      return 1;
    }

    return mag * 3;
  }

  // Add lat long of earthquake from geoJson.
  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // circle marker
    style: styleInfo,
    // Pop up / info
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);

  // Legend
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#ccff33",
      "#ffcc00",
      "#ff9933",
      "#FF0000"
    ];
// squares for the legend
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap);
});
