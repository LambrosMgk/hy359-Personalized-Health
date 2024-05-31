"use strict";

var doctors = [];

$(document).ready(function ()
{
    makeTable();
});

async function makeTable()
{
    getDoctors();
    await new Promise(r => setTimeout(r, 700)); //wait implementation
    let body = document.getElementById("DoctorTableBody");
    $("#DoctorsTableBody").empty();  //clear body before loading new content (otherwise content stacks up)
    let row;
    for (let i = 0; i < doctors.length; i++) {
        row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table

        row.insertCell(0).innerHTML = doctors[i].firstname;
        row.insertCell(1).innerHTML = doctors[i].lastname;
        row.insertCell(2).innerHTML = doctors[i].address;
        row.insertCell(3).innerHTML = doctors[i].telephone;
        row.insertCell(4).innerHTML = doctors[i].specialty;
        row.insertCell(5).innerHTML = doctors[i].price;
    }
}

function getDoctors()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let jsonArray = JSON.parse(xhr.responseText);
            let doctor = {};
            for(let i = 0; i < jsonArray.length; i++)
            {
                doctor.doctor_id = jsonArray[i].doctor_id;
                doctor.firstname = jsonArray[i].firstname;
                doctor.lastname = jsonArray[i].lastname;
                doctor.address = jsonArray[i].address;
                doctor.telephone = jsonArray[i].telephone;
                doctor.specialty = jsonArray[i].specialty;
                doctor.price = 0;

                doctors[i] = doctor;
                getDoctorPrices(jsonArray[i].doctor_id);
            }
        }
        else if (xhr.status !== 200)
        {
            console.log("Request failed, msg from server : " + xhr.responseText);
        }
    };

    xhr.open("GET", "VerifiedDoctors");
    xhr.send();
}

function getDoctorPrices(id)
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {

        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let jsonArray = JSON.parse(xhr.responseText);
            if(jsonArray.length === 0)
            {
                //no rendezvous
            }
            else
            {
                for(let i = 0; i < doctors.length; i++)
                {
                    if (doctors[i].doctor_id === id)
                    {
                        doctors[i].price = jsonArray[0].price;
                    }
                }
            }
        }
        else if (xhr.status !== 200)
        {
            console.log("Request failed, msg from server : " + xhr.responseText);
        }
    };

    xhr.open("POST", "GetRendezvous");
    xhr.send(id);
}