"use strict";

function logout()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            console.log("log out successful");
            //$('#choices').load("buttons.html"); redirect to main page
            //$("#ajaxContent").html("Successful Logout"); add this to main page
        }
        else if (xhr.status !== 200)
        {
            console.log("Failed to log out : " + xhr.responseText);
            //alert('Request failed. Returned status of ' + xhr.status);
        }
        window.location.href = "http://localhost:8080/Health_Project_war_exploded/index.html";
    };
    xhr.open('POST', 'Logout');
    xhr.setRequestHeader('Content-type','/Logout');
    xhr.send();
}