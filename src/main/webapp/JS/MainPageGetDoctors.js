"use strict";

var map;
var mapnik;
var markers
var active_markers = [];
var markers_num = 0;

var lat,lon, user_id;

$(document).ready(function ()
{
    initMap();
    initMarkers();
    //console.log("Initialized map and markers");
    getAllDoctors();
});

function initMap()
{
    map = new OpenLayers.Map("Map");
    mapnik = new OpenLayers.Layer.OSM();
    map.addLayer(mapnik);
}

function initMarkers()
{
    markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
}

function setPosition(lat, lon)
{
    let fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
    let toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    let position = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);

    return position;
}

function handler(position, message){
    let popup = new OpenLayers.Popup.FramedCloud("Popup", position, null, message, null, true);// <-- true if we want a close (X) button, false otherwise

    map.addPopup(popup);
}

function setMarker(position, message)
{
    let mar = new OpenLayers.Marker(position);
    markers.addMarker(mar);

    mar.events.register('mousedown', mar, function(evt) { handler(position, message); } );
    const zoom = 11;
    map.setCenter(position, zoom);

    return mar;
}

function getAllDoctors()    //we obviously need verified doctors only
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        let table = document.getElementById("DoctorsTable");
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            //console.log(xhr.responseText);
            let jsonArray = JSON.parse(xhr.responseText);
            let body = document.getElementById("DoctorsTableBody");
            $("#DoctorsTableBody").empty();  //clear body before loading new content (otherwise content stacks up)
            let row;
            let fn, ln, country, city, address, telephone, speciality, lat, lon;
            for(let i = 0; i < jsonArray.length; i++)
            {
                row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table

                row.insertCell(0).innerHTML = jsonArray[i].firstname;
                row.insertCell(1).innerHTML = jsonArray[i].lastname;
                row.insertCell(2).innerHTML = jsonArray[i].country;
                row.insertCell(3).innerHTML = jsonArray[i].city;
                row.insertCell(4).innerHTML = jsonArray[i].address;
                row.insertCell(5).innerHTML = jsonArray[i].telephone;
                row.insertCell(5).innerHTML = jsonArray[i].specialty;

                //set the table and then create a marker
                fn = jsonArray[i].firstname;
                ln = jsonArray[i].lastname;
                country = jsonArray[i].country;
                city = jsonArray[i].city;
                address = jsonArray[i].address;
                telephone = jsonArray[i].telephone;
                speciality = jsonArray[i].specialty;
                lat = jsonArray[i].lat;
                lon = jsonArray[i].lon;

                //show doctor's that are in heraklion
                if(country === 'Greece' && city === 'Heraklion')    //if there is a typo by the doctor in the city that might cause a problem
                {
                    active_markers[markers_num] = setMarker(setPosition(lat,lon), "Address : " + address + ", Name : "+ fn + " " + ln + "\n, Telephone : " + telephone + ", Speciality : " + speciality);
                    markers_num++;
                }
            }
            map.setCenter(setPosition(35.341846, 25.148254), 11);   //lat lon for Heraklion, center the map in Heraklion
        }
        else if (xhr.status !== 200)
        {
            let row = table.insertRow(0);
            let cell = row.insertCell(0);
            cell.innerHTML = xhr.responseText;
            console.log("Request failed, msg from server : " + xhr.responseText);
        }
    };

    xhr.open('GET', 'VerifiedDoctors');
    xhr.send();
}