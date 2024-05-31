"use strict";

function passwordShow()
{
    let button = document.getElementById("Show password");

    if(parseInt(button.value) === 0)
    {
        document.getElementById("password").type = 'text';
        button.value = 1;
    }
    else if(parseInt(button.value) === 1)
    {
        document.getElementById("password").type = 'password';
        button.value = 0;
    }
}

function passwordCheck()
{
    let pass1 = document.getElementById("password").value;
    let pass2 = document.getElementById("ver_password").value;

    if(pass1 != pass2)
    {
        document.getElementById("matching_pass").style.display = 'block';
        document.getElementById("matching_pass").innerHTML = 'Passwords don\'t match';
        return 0;
    }
    else
    {
        document.getElementById("matching_pass").innerHTML = '';
        document.getElementById("matching_pass").style.display = 'none';
        return 1;
    }
}

function passwordStrength()
{
    let pass = document.getElementById("password").value;
    let i, j, number = 0, chartimes = 0, charweak = 0, samechar = 0;

    
    for(i = 0; i < pass.length; i++)
    {   
        if( Number.isInteger(parseInt(pass.charAt(i))) )
        {
            number++;
        }
        else
        {   
            chartimes = 0;
            for(j = i; j < pass.length; j++)
            {
                if(pass.charAt(i) == pass.charAt(j))
                    chartimes++;
            }

            if(chartimes >= pass.length*0.5)
                charweak = 1;
        }
        
    }

    for(i = 1; i < pass.length; i++)
    {
        for(j = i-1; j >= 0; j--)
        {
            if(pass.charAt(i) == pass.charAt(j))
                samechar ++;
        }
    }

    if(pass.length == 0)
    {
        document.getElementById("password_strength_label").innerHTML = '';
        document.getElementById("password_strength_label").style.display = 'none';
    }
    else if( (number >= pass.length*0.5) || charweak == 1)
    {
        document.getElementById("password_strength_label").style.display = 'inline';
        document.getElementById("password_strength_label").style.color = 'red';
        document.getElementById("password_strength_label").innerHTML = 'Weak password';
    }
    else if((pass.length - samechar) >= pass.length*0.8)
    {
        document.getElementById("password_strength_label").style.display = 'inline';
        document.getElementById("password_strength_label").style.color = 'green';
        document.getElementById("password_strength_label").innerHTML = 'Strong password';
    }
    else
    {
        document.getElementById("password_strength_label").style.display = 'inline';
        document.getElementById("password_strength_label").style.color = 'yellow';
        document.getElementById("password_strength_label").innerHTML = 'Medium password';
    }

}

function doctor_choices()
{
    if(document.getElementById("Doctor").selected)
    {
        document.getElementById("doctor_radio_choices").style.display = "block";
        document.getElementById("Address").innerHTML = 'Medical center address:';
    }
    else
    {
        document.getElementById("doctor_radio_choices").style.display = "none";
        document.getElementById("Address").innerHTML = 'Address:';
    }
}

function AMKA_check()
{
    let amka = document.getElementById("amka").value;
    let bday = document.getElementById("Birthday").value;
    let correct = 1;


    if(amka == '')
    {
        return 0;
    }
    if(amka.charAt(0) != bday.charAt(8) || amka.charAt(1) != bday.charAt(9)) /*day*/
    {
        correct = 0;
    }
    else if(amka.charAt(2) != bday.charAt(5) || amka.charAt(3) != bday.charAt(6)) /*month*/
    {
        correct = 0;
    }
    else if(amka.charAt(4) != bday.charAt(2) || amka.charAt(5) != bday.charAt(3)) /*year*/
    {
        correct = 0;
    }
    
    if(!correct)
    {
        document.getElementById("AMKA_warn_label").style.display = 'block';
    }
    else
    {
        document.getElementById("AMKA_warn_label").style.display = 'none';
    }
    return correct;
}

function TOU_check()
{
    if(document.getElementById("Terms_of_use").checked)
    {
        document.getElementById("TOU_label").innerHTML = '';
        return 1;
    }
    else
    {
        document.getElementById("TOU_label").style.color = 'red';
        document.getElementById("TOU_label").innerHTML = 'You must agree to the Terms of Use';
        return 0;
    }
}

function form_check()
{
    return passwordCheck() && AMKA_check() && TOU_check();
}

var lat, lon;

function fill_lat_lon() //this function exists to ensure lat and lon get a value before submitting the form
{
    let country = document.getElementById("country").value;
    let city = document.getElementById("City").value;
    let address = document.getElementById("Address").value + " " + document.getElementById("Address_number").value;


    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange",function ()
        {
            if (this.readyState === this.DONE)
            {
                let obj = JSON.parse(this.responseText);

                if(Object.keys(obj).length === 0)
                {
                    console.log("Can't find lat lon");
                }
                else
                {
                    console.log("found lat lon");
                    lat = obj[0].lat;
                    lon = obj[0].lon;
                    document.getElementById("lat").value = lat; //maybe delete the other 2 and keep the html fields for lat and lon
                    document.getElementById("lon").value = lon;
                }
            }
        });

    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=" + address + " " + city + " " + country + "&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "16da386f64msh58b0e49ff139f9ep1d0c30jsnba3308bb72fb");
    xhr.send();
}

function check_address()
{
    let country = document.getElementById("country").value;
    let city = document.getElementById("City").value;
    let address = document.getElementById("Address").value + " " + document.getElementById("Address_number").value;


    let xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;
    xhr.addEventListener("readystatechange",function ()
        {
            if (this.readyState === this.DONE)
            {
                //console.log(this.responseText);
                let obj = JSON.parse(this.responseText);

                if(Object.keys(obj).length === 0)
                {
                    document.getElementById("Check_address_label").style.display = 'inline-block';
                    document.getElementById("Check_address_label").innerHTML = 'Can\'t find this address';
                    lat = -1;
                    lon = -1;
                    return;
                }

                if( obj[0].display_name.search("Crete") === -1)
                {
                    document.getElementById("Check_address_label").style.display = 'inline-block';
                    document.getElementById("Check_address_label").innerHTML = 'This service is currently only available in Crete';
                }
                else
                {
                    document.getElementById("Check_address_label").style.display = 'none';

                }
                lat = obj[0].lat;
                lon = obj[0].lon;
                document.getElementById("lat").value = lat; //maybe delete the other 2 and keep the html fields for lat and lon
                document.getElementById("lon").value = lon;
            }
        }
    );

    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=" + address + " " + city + " " + country + "&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "16da386f64msh58b0e49ff139f9ep1d0c30jsnba3308bb72fb");
    xhr.send();

    return address + " " + city + " " + country;
}



function make_marker(position, pop_up_msg)
{
    let mar = new OpenLayers.Marker(position);
    
    mar.events.register('mousedown', mar, function(evt) { handler(position, pop_up_msg); } );
    return mar;
}

async function add_marker()
{
    let address = check_address();
    await new Promise(r => setTimeout(r, 500)); //wait implementation because check_address is a bit slow and i have to press the button 2 times
    if(lat === -1 || lon === -1)
    {
        console.log('Dont know where that it, i won\'t add this');
        return;
    }

    markers.removeMarker(curr_mark);    //curr_mark and markers are on Map script

    let pos = setPosition(lat, lon);    /*read the global lat lon set from check_address()*/
    curr_mark = make_marker(pos, address);
    markers.addMarker(curr_mark);
    //Orismos zoom
    map.setCenter(pos, zoom);
}

function find_me()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    }
    else
    {
        document.getElementById("find_me_button").disabled = true;
        document.getElementById("find_me_label").style.display = 'inline-block';
        document.getElementById("find_me_label").innerHTML = 'Browser doesn\'t support geolocation';
    }
}

function showPosition(position)
{
    document.getElementById("find_me_label").innerHTML = 'Found you with accuracy :' + position.coords.accuracy;
    document.getElementById("find_me_label").style.display = 'inline-block';

    const xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function ()
    {
        if (this.readyState === this.DONE)
        {
            //console.log(this.responseText);
            let obj = JSON.parse(this.responseText);

            if(Object.keys(obj).length != 0)
            {
                document.getElementById("country").value = obj.address.country;
                document.getElementById("City").value = obj.address.city;
                document.getElementById("Address").value = obj.address.road;
                document.getElementById("Postcode").value = obj.address.postcode;

                lat = position.coords.latitude;
                lon = position.coords.longitude;
                document.getElementById("lat").value = lat;
                document.getElementById("lon").value = lon;
                markers.removeMarker(curr_mark);
                let pos = setPosition(lat, lon);    /*read the global lat lon set from check_address()*/
                curr_mark = make_marker(pos, obj.address.road);
                markers.addMarker(curr_mark);
                //Orismos zoom
                const zoom = 12;
                map.setCenter(pos, zoom);
            }
            else
            {
                document.getElementById("find_me_label").innerHTML = 'Couldn\'t find you';
            }
        }
    }
    );

    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/reverse?lat=" + position.coords.latitude +
    "&lon=" + position.coords.longitude +"&accept-language=en&format=json&polygon_threshold=0.0");
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "16da386f64msh58b0e49ff139f9ep1d0c30jsnba3308bb72fb");
    xhr.send();
}

function showError(error)
{
    var x = document.getElementById("find_me_label");
    document.getElementById("find_me_label").style.display = 'inline-block';
    switch(error.code)
    {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred."
        break;
    }
}
  