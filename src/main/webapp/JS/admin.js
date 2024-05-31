"use strict";

$(document).ready(function ()
{
    getUsers();
    getVerDoctors();
    getToVerDoctors();
});

function DeleteUser(id)
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            console.log("Delete user successful");
            getUsers();
        }
        else if (xhr.status !== 200)
        {
            console.log("Error with delete");
        }
    };

    xhr.open('POST', 'DeleteUser');
    xhr.setRequestHeader("Content-type", "/DeleteUser");
    xhr.send(id);
}

function DeleteDoctor(id)     //for both verified and not verified
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            console.log("Delete doctor successful");
            getVerDoctors();
        }
        else if (xhr.status !== 200)
        {
            console.log("Error with delete");
        }
    };

    xhr.open('POST', 'DeleteDoctor');
    xhr.setRequestHeader("Content-type", "/DeleteDoctor");
    xhr.send(id);
}
function VerifyDoctor(id)
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            console.log("Verify successful");
            getVerDoctors();
            getToVerDoctors();
        }
        else if (xhr.status !== 200)
        {
            console.log("Error with verify");
        }
    };

    xhr.open('POST', 'ToVerifyDoctors');
    xhr.setRequestHeader("Content-type", "/ToVerifyDoctors");
    xhr.send(id);
}

function getUsers()         //simple users
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        let table = document.getElementById("UsersTable");
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            //console.log(xhr.responseText);
            let jsonArray = JSON.parse(xhr.responseText);
            let body = document.getElementById("UsersTableBody");
            $("#UsersTableBody").empty();  //clear body before loading new content (otherwise content stacks up)
            let row, btn;
            for(let i = 0; i < jsonArray.length; i++)
            {
                btn = document.createElement('button');
                btn.type = "button";
                btn.id = "delete_user" + i;
                btn.className = "delete_btn";
                btn.innerHTML = "<i class=\"fa fa-trash-o\"></i>";
                btn.onclick = function ()
                {
                    let result = confirm("Want to delete user with id " + jsonArray[i].user_id + "?");
                    if (result)
                    {
                        console.log("Deleting user with id: " + jsonArray[i].user_id);
                        DeleteUser(jsonArray[i].user_id);
                    }
                };

                row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table

                row.insertCell(0).appendChild(btn);
                row.insertCell(1).innerHTML = jsonArray[i].user_id;
                row.insertCell(2).innerHTML = jsonArray[i].username;
                row.insertCell(3).innerHTML = jsonArray[i].email;
                row.insertCell(4).innerHTML = jsonArray[i].firstname;
                row.insertCell(5).innerHTML = jsonArray[i].lastname;
                row.insertCell(6).innerHTML = jsonArray[i].birthdate;
                row.insertCell(7).innerHTML = jsonArray[i].city;
                row.insertCell(8).innerHTML = jsonArray[i].address;
                row.insertCell(9).innerHTML = jsonArray[i].telephone;
            }
        }
        else if (xhr.status !== 200)
        {
            let row = table.insertRow(0);
            let cell = row.insertCell(0);
            cell.innerHTML = xhr.responseText;
            console.log("Request failed, msg from server : " + xhr.responseText);
        }
    };

    xhr.open('GET', 'Users');
    xhr.send();
}

function getVerDoctors()    //verified doctors
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        let table = document.getElementById("DoctorsTable");
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            //console.log(xhr.responseText);
            let jsonArray = JSON.parse(xhr.responseText);
            let body = document.getElementById("DoctorsTableBody");
            $("#DoctorsTableBody").empty();  //clear body before loading new content (otherwise content stacks up)
            let row, btn;
            for(let i = 0; i < jsonArray.length; i++)
            {
                btn = document.createElement('button');
                btn.type = "button";
                btn.id = "delete_doctor" + i;
                btn.className = "delete_btn";
                btn.innerHTML = "<i class=\"fa fa-trash-o\"></i>";
                btn.onclick = function ()
                {
                    let result = confirm("Want to delete doctor with id " + jsonArray[i].doctor_id + "?");
                    if (result)
                    {
                        console.log("Deleting doctor with id: " + jsonArray[i].doctor_id);
                        DeleteDoctor(jsonArray[i].doctor_id);
                    }
                };

                row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table

                row.insertCell(0).appendChild(btn);
                row.insertCell(1).innerHTML = jsonArray[i].doctor_id;
                row.insertCell(2).innerHTML = jsonArray[i].firstname;
                row.insertCell(3).innerHTML = jsonArray[i].lastname;
                row.insertCell(4).innerHTML = jsonArray[i].country;
                row.insertCell(5).innerHTML = jsonArray[i].city;
                row.insertCell(6).innerHTML = jsonArray[i].address;
                row.insertCell(7).innerHTML = jsonArray[i].specialty;
                row.insertCell(8).innerHTML = jsonArray[i].telephone;
            }
        }
        else if (xhr.status !== 200)
        {
            let row = table.insertRow(0);
            let cell = row.insertCell(0);
            cell.innerHTML = xhr.responseText;
            console.log("Request failed, msg from server : " + xhr.responseText);
        }
    };

    xhr.open('GET', 'VerifiedDoctors');
    xhr.send();
}

function getToVerDoctors()  //to verify doctors
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        let table = document.getElementById("ToVerDoctorsTable");
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            //console.log(xhr.responseText);
            let jsonArray = JSON.parse(xhr.responseText);
            let body = document.getElementById("ToVerDoctorsTableBody");
            $("#ToVerDoctorsTableBody").empty();  //clear body before loading new content (otherwise content stacks up)
            let row, btn, cbtn;
            for(let i = 0; i < jsonArray.length; i++)
            {
                btn = document.createElement('button');
                btn.type = "button";
                btn.id = "delete_doctor" + i;
                btn.className = "delete_btn";
                btn.innerHTML = "<i class=\"fa fa-trash-o\"></i>";
                btn.onclick = function ()
                {
                    let result = confirm("Want to delete doctor with id " + jsonArray[i].doctor_id + "?");
                    if (result)
                    {
                        console.log("Canceling rendezvous with id: " + jsonArray[i].doctor_id);
                        DeleteDoctor(jsonArray[i].doctor_id);
                    }
                };

                cbtn = document.createElement('button');
                cbtn.type = "button";
                cbtn.id = "verify_doctor" + i;
                cbtn.className = "delete_btn";
                cbtn.innerHTML = "&#10003";
                cbtn.onclick = function ()
                {
                    let result = confirm("Want to verify doctor with id " + jsonArray[i].doctor_id + "?");
                    if (result)
                    {
                        console.log("Verifying doctor with id: " + jsonArray[i].doctor_id);
                        VerifyDoctor(jsonArray[i].doctor_id);
                    }
                };

                row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table

                row.insertCell(0).appendChild(btn);
                row.insertCell(1).appendChild(cbtn);
                row.insertCell(2).innerHTML = jsonArray[i].doctor_id;
                row.insertCell(3).innerHTML = jsonArray[i].firstname;
                row.insertCell(4).innerHTML = jsonArray[i].lastname;
                row.insertCell(5).innerHTML = jsonArray[i].country;
                row.insertCell(6).innerHTML = jsonArray[i].city;
                row.insertCell(7).innerHTML = jsonArray[i].address;
                row.insertCell(8).innerHTML = jsonArray[i].specialty;
                row.insertCell(9).innerHTML = jsonArray[i].telephone;
            }
        }
        else if (xhr.status !== 200)
        {
            let row = table.insertRow(0);
            let cell = row.insertCell(0);
            cell.innerHTML = xhr.responseText;
            console.log("Request failed, msg from server : " + xhr.responseText);
        }
    };

    xhr.open('GET', 'ToVerifyDoctors');
    xhr.send();
}