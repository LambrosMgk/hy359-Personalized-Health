"use strict";

function getDoneRendezvous()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let jsonArray = JSON.parse(this.responseText);
            let body = document.getElementById("DoneRend_Table_body");
            $("#DoneRend_Table_body").empty();  //clear body before loading new content
            let row;

            if(jsonArray.length === 0)
            {
                console.log("you don't have done rendezvouse!");
                row = body.insertRow(0);
                row.insertCell(0).innerHTML = 'No previous rendezvous';
            }

            for(let i = 0; i < jsonArray.length; i++)
            {
                row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table


                row.insertCell(0).innerHTML = jsonArray[i].randevouz_id;
                row.insertCell(1).innerHTML = jsonArray[i].date_time;
                row.insertCell(2).innerHTML = jsonArray[i].price;
                if(jsonArray[i].doctor_info === "null")
                    row.insertCell(3).innerHTML = ' ';
                else
                    row.insertCell(3).innerHTML = jsonArray[i].doctor_info;

                if(jsonArray[i].user_info === "null")
                    row.insertCell(4).innerHTML = ' ';
                else
                    row.insertCell(4).innerHTML = jsonArray[i].user_info;
            }
        }
        else if (xhr.status !== 200)
        {
            console.log("Error with getting done rendezvous");
        }
    };

    xhr.open('GET', 'GoToRendezvous');
    xhr.setRequestHeader("Content-type", "/GoToRendezvous");
    xhr.send();
}