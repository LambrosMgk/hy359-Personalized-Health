let map = new OpenLayers.Map("Map");
let mapnik = new OpenLayers.Layer.OSM();
map.addLayer(mapnik);

let curr_mark;
let markers;

function setPosition(lat, lon)
{
    let fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984

    let toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection

    let position = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);

    return position;
}

function handler(position, message)
{
    let popup = new OpenLayers.Popup.FramedCloud("Popup", position, null, message, null, true); // <-- true if we want a close (X) button, false otherwise
    map.addPopup(popup);
}

//Markers
markers = new OpenLayers.Layer.Markers( "Markers" );
map.addLayer(markers);

//Protos Marker
let position = setPosition(35.3053121,25.0722869);
let mar = new OpenLayers.Marker(position);
curr_mark = mar;    //to know the first marker in the other script
markers.addMarker(mar);
mar.events.register('mousedown', mar, function(evt) { handler(position,'FORTH-ITE'); } );

//Orismos zoom
let zoom = 12;
map.setCenter(position, zoom);
