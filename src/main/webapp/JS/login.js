"use strict";

$(document).ready(function ()
{
    isLoggedIn();
});

function loginPOST()
{
    document.getElementById("error_msg").style.display = 'none';

    let xhr = new XMLHttpRequest();
    let myForm = document.getElementById('myForm');
    let formData = new FormData(myForm);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    let jsonData = JSON.stringify(data);
    xhr.onload = function ()
    {
        let obj = JSON.parse(xhr.responseText);
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            localStorage.setItem("username", obj.username);    //for the user and doctor pages (usernames are unique)
            console.log("Login successful , " + obj.responseText);
            window.location.href = obj.href;    //servlet decides if it's a doctor or user (or admin) and gives the href
        }
        else if (xhr.status !== 200)
        {
            console.log("Request failed, msg from server : " + obj.responseText);
            document.getElementById("error_msg").style.display = 'inline';
        }
    };

    xhr.open('POST', 'LoginServlet');
    xhr.setRequestHeader("Content-type", "/LoginServlet");
    xhr.send(jsonData);
}

function isLoggedIn()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {

        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let obj = JSON.parse(xhr.responseText);
            console.log("Already logged in, redirecting");
            window.location.href = obj.href;            //servlet knows if its user or doctor and send href accordingly
        }
        else if (xhr.status !== 200)
        {
            console.log("not logged in.");
        }
    };

    xhr.open('GET', 'LoginServlet');
    xhr.send();
}


function passwordShow()
{
    let button = document.getElementById("password_button");

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