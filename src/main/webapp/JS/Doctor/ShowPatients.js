"use strict";

$(document).ready(function ()
{
    getPatients();
});

function SelectedUser(id)
{
    //set the other's html element with this id (maybe change it to first/last name later)
    document.getElementById("selected_id").value = id;
    getBloodTests();    //update exams
}
function getPatients()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        let table = document.getElementById("PatientTable");
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let jsonArray = JSON.parse(xhr.responseText);
            let body = document.getElementById("PatientTableBody");
            $("#PatientTableBody").empty();  //clear body before loading new content (otherwise content stacks up) (i include jquery in simpleuser)
            let row, btn;
            for(let i = 0; i < jsonArray.length; i++)
            {
                btn = document.createElement('button');
                btn.type = "button";
                btn.id = "select_test" + i;
                btn.className = "delete_btn";
                btn.innerHTML = "&#10003";
                btn.onclick = function ()
                {
                    console.log("Selected user with id: " + jsonArray[i].user_id);
                    SelectedUser(jsonArray[i].user_id);
                };

                row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table

                row.appendChild(btn);
                row.insertCell(0).innerHTML = jsonArray[i].firstname;
                row.insertCell(1).innerHTML = jsonArray[i].lastname;
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

    xhr.open('GET', 'GetPatients');
    xhr.send();
}