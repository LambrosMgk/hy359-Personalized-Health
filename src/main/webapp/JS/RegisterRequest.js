"use strict";

function RegisterRequest()
{
    if(form_check() === 0)  //checks amka, TOU and if passwords are the same
    {
        console.log("form is not correct");
        return false;
    }
    if(Check_database() === false)  //checks username, email and amka in database
    {
        console.log("Credentials already being used.");
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
            localStorage.setItem("choice", document.getElementById("user_select").value);
            localStorage.setItem("servermsg", xhr.responseText);
        }
        else if (xhr.status !== 200)
        {
            console.log("Request failed, msg from server : " + xhr.responseText);
            localStorage.setItem("servermsg", "Request failed");
            localStorage.setItem("choice", null);
        }
        window.location.href = "http://localhost:8080/Health_Project_war_exploded/RegisterComplete.html";
    };

    xhr.open('POST', 'RegisterServlet');
    xhr.setRequestHeader("Content-type", "/RegisterServlet");
    xhr.send(jsonData);
}