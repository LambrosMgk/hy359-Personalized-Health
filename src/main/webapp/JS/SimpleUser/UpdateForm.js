"use strict";

var curr_email;
var emailOk;

function GetData()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let obj = JSON.parse(this.responseText);
            //console.log(this.responseText);
            curr_email = obj.email;
            document.getElementById("username").value = obj.username;
            document.getElementById("email").value = obj.email;
            document.getElementById("firstname").value = obj.firstname;
            document.getElementById("lastname").value = obj.lastname;
            document.getElementById("birthdate").value = obj.birthdate;
            $('input:radio[name="gender"]').filter('[value=' + obj.gender + ']').attr('checked', true);
            document.getElementById("amka").value = obj.amka;
            document.getElementById("country").value = obj.country;
            document.getElementById("city").value = obj.city;
            document.getElementById("address").value = obj.address;
            document.getElementById("telephone").value = obj.telephone;
            document.getElementById("height").value = obj.height;
            document.getElementById("weight").value = obj.weight;
            $('input:radio[name="blooddonor"]').filter('[value=' + obj.blooddonor + ']').attr('checked', true);
            document.getElementById("bloodtype").value = obj.bloodtype;
        }
        else if (xhr.status !== 200)
        {
            console.log("probably didn't find user : " + this.responseText);
        }
    };

    xhr.open('GET', 'ChangeUserInfo');
    xhr.send();
}

function SearchEmailDatabase()
{
    let email = document.getElementById("email").value;
    if(curr_email === email)
    {
        console.log("Email is the same");
        emailOk = 1;
        return;
    }

    let json = JSON.stringify(['email', email]);
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if(xhr.readyState === 4 && xhr.status === 200)
        {
            document.getElementById("email_check").innerHTML = "&#10004; Email not used";
            emailOk = 1;
        }
        else if(xhr.status !== 200)
        {
            document.getElementById("email_check").innerHTML = "&#10006; Email already used";
            emailOk = 0;
        }
        console.log(xhr.responseText);
    }

    xhr.open('POST', 'Check_user_form');
    xhr.setRequestHeader("Content-type", "/Check_user_form");
    xhr.send(json);
}

function UpdateData()
{
    check_address();//to fill lat and lon
    if(TOU_check() === 0)
    {
        console.log("Must check Terms Of Use");
        return false;
    }
    if(passwordCheck() === 0)
    {
        console.log("Passwords don't match");
        return false;
    }
    SearchEmailDatabase();
    if(emailOk === 0)
    {
        console.log("email already being used");
        return false;
    }
    let myForm = document.getElementById('myForm');
    let formData = new FormData(myForm);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    let jsonData = JSON.stringify(data);
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            console.log(xhr.responseText);

        }
        else if (xhr.status !== 200)
        {
            console.log("Request failed, msg from server : " + xhr.responseText);

        }
    };

    xhr.open('POST', 'ChangeUserInfo');
    xhr.setRequestHeader("Content-type", "/ChangeUserInfo");
    xhr.send(jsonData);
}

//copy from RegisterForm with some small changes

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


function check_address()
{
    let country = document.getElementById("country").value;
    let city = document.getElementById("city").value;
    let address = document.getElementById("address").value + " " + document.getElementById("Address_number").value;


    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange",function ()
        {
            if (this.readyState === this.DONE)
            {
                let obj = JSON.parse(this.responseText);
                //console.log("checking address : " + address + " " + city + " " + country);
                //console.log(this.responseText);

                if(Object.keys(obj).length === 0)
                {
                    document.getElementById("Check_address_label").innerHTML = 'Can\'t find this address, you can still submit though!';
                    document.getElementById("lat").value = -1;
                    document.getElementById("lon").value = -1;
                    return;
                }

                if(obj[0].display_name.search("Crete") === -1)
                {
                    document.getElementById("Check_address_label").innerHTML = 'This service is currently only available in Crete';
                }
                else
                {
                    document.getElementById("Check_address_label").innerHTM = 'Found you in Crete :)';
                }
                document.getElementById("lat").value = obj[0].lat;
                document.getElementById("lon").value = obj[0].lon;
            }
        }
    );

    xhr.open("GET", "https://forward-reverse-geocoding.p.rapidapi.com/v1/search?q=" + address + "%20" + city + "%20" + country + "&accept-language=en&polygon_threshold=0.0");
    xhr.setRequestHeader("x-rapidapi-host", "forward-reverse-geocoding.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "16da386f64msh58b0e49ff139f9ep1d0c30jsnba3308bb72fb");
    xhr.send();

    return address + " " + city + " " + country;
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
    xhr.addEventListener("readystatechange", function ()
        {
            if (this.readyState === this.DONE)
            {
                //console.log(this.responseText);
                let obj = JSON.parse(this.responseText);

                if(Object.keys(obj).length != 0)
                {
                    document.getElementById("country").value = obj.address.country;
                    document.getElementById("city").value = obj.address.city;
                    document.getElementById("address").value = obj.address.road;
                    document.getElementById("Postcode").value = obj.address.postcode;

                    console.log("Found lat : " + position.coords.latitude + " and lon : " + position.coords.longitude);
                    document.getElementById("lat").value = position.coords.latitude;
                    document.getElementById("lon").value = position.coords.longitude;
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
