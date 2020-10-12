//Colors for circles and legend
var mapColors = ["greenyellow", "yellow", "gold", "goldenrod", "sandybrown", "tomato"];

//URL of data
var url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//Get the JSON from the URL
d3.json(url, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {

    //Set the earthquake info
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: createMarker,
        onEachFeature: onEachFeature
    });

    //Create the popup for each earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h2>" + feature.properties.place + "</h2><hr><p>Magnitude: " + feature.properties.mag + 
        "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Date: "+ new Date(feature.properties.time) + "</p>");
    }

    //Set the size and color of the earthquake circle
    function createMarker(feature, latlng) {
        var myStyle = {
            radius: feature.properties.mag * 4,
            fillOpacity: 0.5,
            color: markerColor(feature.geometry.coordinates[2]),
        }
        return new L.CircleMarker(latlng, myStyle)
    }

    //Set the color baseed on the depth of the earthquake
    function markerColor(depth) {
        if (depth > 90) {return mapColors[5]}
        else if (depth > 70 && depth <= 90) {return mapColors[4]}
        else if (depth > 50 && depth <= 70) {return mapColors[3]}
        else if (depth > 30 && depth <= 50) {return mapColors[2]}
        else if (depth > 10 && depth <= 30) {return mapColors[1]}
        else {return mapColors[0]}
    }

    //And create
    createMap(earthquakes);
}

function createMap(earthquakes) {

    //Set the grayscale layer
    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 10,
        id: "light-v10",
        accessToken: API_KEY
    });

    var baseMaps = {"Greyscale": grayscale};
    var overlayMaps = {"Earthquakes": earthquakes};

    //Set the map info
    var myMap = L.map("map", {
        center: [15.5994, -28.6731],
        zoom: 2.5,
        layers: [grayscale, earthquakes]
    });

    //Add layers to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

   // Set up the legend
   var legend = L.control({ position: "bottomright" });
   legend.onAdd = function() {
        //The labels for each color
        var labels = ["-10 - 10", "10 - 30", "30 - 50", "50 - 70", "70 - 90", "90+"];

        //Start the ordered list
        var list = '<ul style="list-style-type:none;"><li>Earthquake Depth</li>';
        
        //Create the div
        var div = L.DomUtil.create("div");

        //Add list item for each color
        labels.forEach(function(x, index) {
            list += "<li style=\"background-color: " + mapColors[index] + "\"> " + labels[index] + "</li>";
        });

        //Finish off the list html
        div.innerHTML += list + "</ul>";
        return div;
   };
 
   // Adding legend to the map
   legend.addTo(myMap);
 }
