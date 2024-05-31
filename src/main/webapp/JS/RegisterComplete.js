"use strict";

function set_message()
{
    let choice = localStorage.getItem("choice");
    let servermsg = localStorage.getItem("servermsg");

    if (choice === null)
    {
        document.getElementById("registration_header").innerHTML = "Server error!\n(don't worry we are fixing it!)";
    }
    else if(choice === "User")
    {
        document.getElementById("registration_header").innerHTML = servermsg;
        document.getElementById("mark").innerHTML = "&#10004";
    }
    else if(choice === "Doctor")
    {
        document.getElementById("registration_header").innerHTML = servermsg;
        document.getElementById("mark").innerHTML = "&#10004";
    }
}