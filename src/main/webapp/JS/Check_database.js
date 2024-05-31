"use strict";

var usernameOk = 0;
var emailOk = 0;
var amkaOk = 0;

function SearchUsernameDatabase()
{
    let username = document.getElementById("username").value;
    if(username.length < 8)
    {
        document.getElementById("username_check").innerHTML = "&#10006; Username must be atleast 8 characters long";
        return;
    }

    let json = JSON.stringify(['username', username]);
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
        {
            if(xhr.readyState === 4 && xhr.status === 200)
            {
                document.getElementById("username_check").innerHTML = "&#10004; Valid username";
                usernameOk = 1;
            }
            else if(xhr.status !== 200)
            {
                document.getElementById("username_check").innerHTML = "&#10006; Username already taken";
                usernameOk = 0;
            }
            console.log(xhr.responseText);
        }

    xhr.open('POST', 'Check_user_form');
    xhr.setRequestHeader("Content-type", "/Check_user_form");
    xhr.send(json);
}

function SearchEmailDatabase()
{
    let email = document.getElementById("email").value;
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

function SearchAmkaDatabase()
{
    let amka = document.getElementById("amka").value;
    let json = JSON.stringify(['amka', amka]);
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if(xhr.readyState === 4 && xhr.status === 200)
        {
            document.getElementById("amka_check").style.display = "none";
            amkaOk = 1;
        }
        else if(xhr.status !== 200)
        {
            document.getElementById("amka_check").style.display = "inline";
            document.getElementById("amka_check").innerHTML = "&#10006; AMKA already in use";
            amkaOk = 0;
        }
        console.log(xhr.responseText);
    }

    xhr.open('POST', 'Check_user_form');
    xhr.setRequestHeader("Content-type", "/Check_user_form");
    xhr.send(json);
}

function Check_database()
{
    if(usernameOk === 0 || emailOk === 0 || amkaOk === 0)
    {
        return false;
    }
    return true;
}