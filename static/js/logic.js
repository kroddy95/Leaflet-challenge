var url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Grabbing our GeoJSON data..
d3.json(url, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
 
    function markerSize(magnitude) {
        return magnitude * 3;
    }

    function markerColor(depth) {
        console.log(depth)
        if (depth > 90) {
            return "red";
        }
        else if (depth > 70 && depth <= 90) {
            return "DarkOrange";
        }
        else if (depth > 50 && depth <= 70) {
            return "Orange";
        }
        else if (depth > 30 && depth <= 50) {
            return "GoldenRod";
        }
        else if (depth > 10 && depth <= 30) {
            return "GreenYellow";
        }
        else {
            return "green";
        }
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    function createMarker(feature, latlng) {
        var myStyle = {
            radius: markerSize(feature.properties.mag),
            fillOpacity: 0.5,
            color: markerColor(feature.geometry.coordinates[2]),
        }
        return new L.CircleMarker(latlng, myStyle)
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: createMarker,
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });


    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Greyscale": grayscale
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create our map, giving it the satellite and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [15.5994, -28.6731],
        zoom: 1.5,
        layers: [grayscale, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
     var markers = L.circle(feature.properties.place, {
        fillOpacity: 0.75,
        color: "black",
        fillColor: "purple",
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its population
        radius: markerSize(feature.properties.mag)
    })