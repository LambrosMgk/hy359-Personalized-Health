"use strict";

function goToRendezvous(id)
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            getActiveRendezvous();
        }
        else if (xhr.status !== 200)
        {
            console.log("Error with going to rendezvous");
        }
    };

    xhr.open('POST', 'GoToRendezvous');
    xhr.setRequestHeader("Content-type", "/GoToRendezvous");
    xhr.send(id);
}

function CancelRendezvous(id)
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            getActiveRendezvous();
        }
        else if (xhr.status !== 200)
        {
            console.log("Error with cancel");
        }
    };

    xhr.open('POST', 'RendezvousCancel');
    xhr.setRequestHeader("Content-type", "/RendezvousCancel");
    xhr.send(id);
}

function getActiveRendezvous()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if(xhr.readyState === 4 && xhr.status === 200)
        {
            let jsonArray = JSON.parse(this.responseText);
            let body = document.getElementById("ActiveRend_Table_body");
            $("#ActiveRend_Table_body").empty();  //clear body before loading new content
            let row, btn, cbtn, gbtn;

            if(jsonArray.length === 0)
            {
                console.log("you don't have active rendezvous go make some!");
                row = body.insertRow(0);
                row.insertCell(0).innerHTML = 'No active rendezvous';
            }

            for(let i = 0; i < jsonArray.length; i++)
            {
                btn = document.createElement('button');
                btn.type = "button";
                btn.id = "select_rendezvous" + i;
                btn.className = "select_btn";
                btn.innerHTML = "&#10003";
                btn.onclick = function ()
                {
                    document.getElementById("Rend_id").value = jsonArray[i].randevouz_id;
                    document.getElementById("rendezvous_textarea").value = jsonArray[i].user_info;
                };

                cbtn = document.createElement('button');
                cbtn.type = "button";
                cbtn.id = "cancel_rendezvous" + i;
                cbtn.className = "select_btn";
                cbtn.innerHTML = "&#10005";
                cbtn.onclick = function ()
                {
                    let result = confirm("Want to cancel?");
                    if (result)
                    {
                        console.log("Canceling rendezvous with id: " + jsonArray[i].randevouz_id);
                        CancelRendezvous(jsonArray[i].randevouz_id);
                    }
                };

                gbtn = document.createElement('button');
                gbtn.type = "button";
                gbtn.id = "go_rendezvous" + i;
                gbtn.className = "select_btn";
                gbtn.innerHTML = "Done";
                gbtn.onclick = function ()
                {
                    console.log("Going to rendezvous (hope it goes well)");
                    goToRendezvous(jsonArray[i].randevouz_id);
                };

                row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table

                row.insertCell(0).appendChild(gbtn);
                row.insertCell(1).appendChild(btn);
                row.insertCell(2).appendChild(cbtn);
                row.insertCell(3).innerHTML = jsonArray[i].randevouz_id;
                row.insertCell(4).innerHTML = jsonArray[i].date_time;
                row.insertCell(5).innerHTML = jsonArray[i].price;
                if(jsonArray[i].doctor_info === "null")
                    row.insertCell(6).innerHTML = ' ';
                else
                    row.insertCell(6).innerHTML = jsonArray[i].doctor_info;

                if(jsonArray[i].user_info === "null")
                    row.insertCell(7).innerHTML = ' ';
                else
                    row.insertCell(7).innerHTML = jsonArray[i].user_info;
            }
        }
        else if (xhr.status !== 200)
        {
            console.log(this.responseText);
        }
    }

    xhr.open("GET", "UserRendezvousUpdate");
    xhr.send();
}

function UpdateUserInfo()
{
    document.getElementById("UpdateRendezvousLabel").innerHTML = "";    //reset label

    let xhr = new XMLHttpRequest();
    let obj = {};
    obj.info = document.getElementById("rendezvous_textarea").value;
    obj.rendezvous_id = document.getElementById("Rend_id").value;
    let data = JSON.stringify(obj);
    xhr.onload = function ()
    {
        if(xhr.readyState === 4 && xhr.status === 200)
        {
            console.log("updated!");
            document.getElementById("UpdateRendezvousLabel").style.color = 'green';
            document.getElementById("UpdateRendezvousLabel").innerHTML = "Updated!";
            document.getElementById("rendezvous_textarea").value = '';
            document.getElementById("Rend_id").value = '';
            getActiveRendezvous();  //refresh table
        }
        else if(xhr.status !== 200)
        {
            document.getElementById("UpdateRendezvousLabel").style.color = 'red';
            document.getElementById("UpdateRendezvousLabel").innerHTML = "Something went wrong.";
        }
    }

    xhr.open("POST", "UserRendezvousUpdate");
    xhr.send(data);
}