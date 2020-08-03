// Useful round number function
function roundNumber(number, tensplace = 10) {
  return Math.round(number * tensplace) / tensplace;
}

var markers = [];
const COORDI = [28.4, 83.99];


function getFeaturesInView() {
  var features = [];
  leafletMap.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {

      if (leafletMap.getBounds().contains(layer.getLatLng())) {

        features.push({
          coordinates: layer._latlng,
          popupContent: layer._popup._content
        });


      }
    }
  });
  return features;
}


function addMarker(e) {
  // Add marker to map at click location; add popup window
  var newMarker = new L.marker(e.latlng)
    .addTo(leafletMap)
    .bindPopup(popupLayout, markerOptions)
    .openPopup()
    ;
  markers.push(newMarker);


  // i need a sample marker text generator here..


  // sampleMarkerTex(newMarker)

}

// Define some maps options
var mapOptions = {
  center: COORDI,
  zoom: 13,
  dragging: true,
}

// this can be made iterable
//marker options

var markerOptions = {
  removable: true,
  editable: true,
  maxWidth: 750,
  autoPan: false
};

//popup layout

const sampleMarkerText = [

  `<h3>Hospital 1</h3><br>
     <p>This is hospital 1.</p><br>`
  ,

  `<h1>Hospital 1</h1><br>
 
     <p>This is hospital 1.</p><br>
     
     <button>Hey</button>`

];

var popupLayout = sampleMarkerText[0];

//Create a map and assign it to the map div
var leafletMap = L.map('leafletMapid', mapOptions);


//on click functionality
newMarkerGroup = new L.LayerGroup();
leafletMap.on('click', addMarker);


//  Add a baselayer 
var mapBoxOutdoors = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Tiles &copy; Esri &mdash; Sources: OpenStreetMaps',
  maxZoom: 18,
}).addTo(leafletMap);


//here i need to create these 

// Note how popup content can be written as an HTML string, or as JSX within a single node:





L.marker(COORDI).addTo(leafletMap)
  .bindPopup(popupLayout, markerOptions)
  .openPopup()




//lets work with submit button
var submitMap = document.querySelector('#submitMap');
submitMap.addEventListener('click', function () {
  //on submit event happener

  newMarkerGroup.clearLayers();

  var feat = getFeaturesInView();
  //console.log(feat);


  /*POST request comming soon  */


  //after submition we will use the feat object to make new markers alright



  /* GET request coming soon */
  feat.map((marker, index) => {
    console.log(marker.coordinates)
    console.log(marker.popupContent)


    L.marker(marker.coordinates, { icon: greenIcon })
      .addTo(leafletMap)
      .bindPopup(`${marker.popupContent}`, {

        maxWidth: 750,
        autoPan: false
      });
      

  })


})



//leaflet icons

var LeafIcon = L.Icon.extend({
  options: {
    iconSize: [38, 38],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  }
});

var greenIcon = new LeafIcon({
  iconUrl: 'https://i.ibb.co/sJrMTdz/favicon-32x32.png'

})


/* L.marker(COORDI, {icon: greenIcon})
  .addTo(leafletMap)
  .bindPopup(popupLayout ,markerOptions)
  .openPopup();
 */