"use strict";

var curr_email;
var emailOk;

function GetDoctorData()
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
            document.getElementById("doctor_textarea").value = obj.doctor_info;
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

    xhr.open('GET', 'ChangeDoctorInfo');
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
            document.getElementById("email_check").innerHTML = "&#10004; Email ok";
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

function UpdateDoctorData()
{
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
            //document.getElementById("confirmLabel").innerHTML = 'Update successful';
        }
        else if (xhr.status !== 200)
        {
            console.log("Request failed, msg from server : " + xhr.responseText);
        }
    };

    xhr.open('POST', 'ChangeDoctorInfo');
    xhr.setRequestHeader("Content-type", "/ChangeDoctorInfo");
    xhr.send(jsonData);
}
