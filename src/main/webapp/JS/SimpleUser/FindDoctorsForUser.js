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
    SetDoctorMarkers();
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

function GetDoctorRendezvous(id)    //could maybe keep them in a list and display them in "pages" with  << 1,2,3.. >> .... and also give sorting options by date and price?
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        let body = document.getElementById("UserRend_Table_body");
        if(xhr.readyState === 4 && xhr.status === 200)
        {
            let jsonArray = JSON.parse(xhr.responseText);
            $("#UserRend_Table_body").empty();  //clear body before loading new content
            let row, btn;
            if(jsonArray.length === 0)
            {
                console.log("No rendezvous");
                row = body.insertRow(0);
                row.insertCell(0).innerHTML = 'No rendezvous available';
            }
            for(let i = 0; i < jsonArray.length; i++)
            {
                btn = document.createElement('button');
                btn.type = "button";
                btn.id = "select_rendezvous" + i;
                btn.className = 'select_btn';
                btn.innerHTML = "&#10003;";
                btn.onclick = function ()
                {
                    let result = confirm("Want this rendezvous for " + jsonArray[i].date_time + "?");
                    if (result)
                    {
                        console.log("Selecting rendezvous with id: " + jsonArray[i].randevouz_id);
                        let obj = {};
                        obj.rendezvous_id = jsonArray[i].randevouz_id;
                        obj.user_id = user_id;
                        let data = JSON.stringify(obj);
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function ()
                        {
                            if(xhr.readyState === 4 && xhr.status === 200)
                            {
                                GetDoctorRendezvous(id);     //refresh the table
                            }
                            else if(xhr.status !== 200)
                            {

                            }
                        };

                        xhr.open("POST", "SelectRendezvous");
                        xhr.send(data);
                    }
                };

                row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table

                row.insertCell(0).appendChild(btn);
                row.insertCell(1).innerHTML = jsonArray[i].status;
                row.insertCell(2).innerHTML = jsonArray[i].randevouz_id;
                row.insertCell(3).innerHTML = jsonArray[i].date_time;
                row.insertCell(4).innerHTML = jsonArray[i].price;
                if(jsonArray[i].doctor_info === "null")
                    row.insertCell(5).innerHTML = ' ';
                else
                    row.insertCell(5).innerHTML = jsonArray[i].doctor_info;
            }
        }
        else if(xhr.status !== 200)
        {
            let row = body.insertRow(0);
            let cell = row.insertCell(0);
            cell.innerHTML = xhr.responseText;
            console.log("Request failed, msg from server : " + xhr.responseText);
        }
    };

    xhr.open('POST', 'GetRendezvous');
    xhr.send(id);
}

function selectedDoctor(id)
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            //console.log(xhr.responseText);
            let jsonArray = JSON.parse(xhr.responseText);
            for(let i = 0; i < jsonArray.length; i++)
            {
                if(jsonArray[i].doctor_id === id)   //or i could use doctors username both are unique
                {
                    document.getElementById("doc_fname").value = jsonArray[i].firstname;
                    document.getElementById("doc_lname").value = jsonArray[i].lastname;
                    document.getElementById("doc_address").value = jsonArray[i].address;
                    document.getElementById("doc_tel").value = jsonArray[i].telephone;
                    document.getElementById("doc_spec").value = jsonArray[i].specialty;
                    CalculateCarDistance(jsonArray[i].lat, jsonArray[i].lon);
                    GetDoctorRendezvous(id);
                }
            }
        }
        else if (xhr.status !== 200)
        {
            console.log("Error with getting doctors :" + xhr.responseText);
        }
    };

    xhr.open('GET', 'VerifiedDoctors');
    xhr.send();
}

function setMarker(id, position, message)
{
    let mar = new OpenLayers.Marker(position);
    markers.addMarker(mar);

    mar.events.register('mousedown', mar, function(evt) { handler(position, message); if(id !== null)selectedDoctor(id); } );
    const zoom = 11;
    map.setCenter(position, zoom);

    return mar;
}

function GetUserLocation()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let obj = JSON.parse(this.responseText);
            lat = obj.lat;
            lon = obj.lon;
            user_id = obj.user_id;

            active_markers[markers_num] = setMarker(null, setPosition(lat,lon), "You");
            markers_num++;
        }
        else if (xhr.status !== 200)
        {
            console.log("Error getting user location : " + this.responseText);
        }
    };

    xhr.open('GET', 'ChangeUserInfo');
    xhr.send();
}

function CalculateCarDistance(doclat, doclon)
{
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange",
function ()
    {
        if (this.readyState === this.DONE)
        {
            //console.log(this.responseText);
            let obj = JSON.parse(this.responseText);
            //console.log(obj.durations[0][0]);
            if(obj.durations[0][0] !== null)
            {
                document.getElementById("carDistance").value = parseInt(obj.distances[0]/1000) + "." + obj.distances[0]%1000 + " Kilometers";
                document.getElementById("carTime").value = obj.durations[0]/60 + " Minutes";
            }
        }
    });
    xhr.open("GET", "https://trueway-matrix.p.rapidapi.com/CalculateDrivingMatrix?origins=" + lat + "%2C" + lon + "&destinations=" + doclat +"%2C" + doclon);

    xhr.setRequestHeader("x-rapidapi-host", "trueway-matrix.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "16da386f64msh58b0e49ff139f9ep1d0c30jsnba3308bb72fb");
    xhr.send();
}

function SetDoctorMarkers()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let jsonArray = JSON.parse(xhr.responseText);
            let id, fn, ln, country, city, address, telephone, speciality, lat, lon;
            for(let i = 0; i < jsonArray.length; i++)
            {
                id = jsonArray[i].doctor_id;
                fn = jsonArray[i].firstname;
                ln = jsonArray[i].lastname;
                country = jsonArray[i].country;
                city = jsonArray[i].city;
                address = jsonArray[i].address;
                telephone = jsonArray[i].telephone;
                speciality = jsonArray[i].specialty;
                lat = jsonArray[i].lat;
                lon = jsonArray[i].lon;

                //sort by user's location
                if(country === 'Greece' && city === 'Heraklion')    //if there is a typo by the doctor in the city that might cause a problem
                {
                    active_markers[markers_num] = setMarker(id, setPosition(lat,lon), "Address : " + address + ", Name : "+ fn + " " + ln + "\n, Telephone : " + telephone + ", Speciality : " + speciality);
                    markers_num++;
                }
            }
            //get users location to focus the map
            GetUserLocation();
        }
        else if (xhr.status !== 200)
        {
            console.log("Error with getting doctors :" + xhr.responseText);
        }
    };

    xhr.open('GET', 'VerifiedDoctors');
    xhr.send();
}