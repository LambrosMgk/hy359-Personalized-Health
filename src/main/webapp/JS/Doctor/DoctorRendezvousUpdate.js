"use strict";

function getRendezvousWithId()
{
    let id = document.getElementById("rendezvous_id").value;
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let jsonArray = JSON.parse(xhr.responseText);
            if(jsonArray.length === 0)
            {
                console.log("No rendezvous");
            }
            for(let i = 0; i < jsonArray.length; i++)
            {
                if(jsonArray[i].randevouz_id === id)
                {
                    document.getElementById("rendezvous_price_update").value = jsonArray[i].price;
                    document.getElementById("rendezvous_textarea_update").value = jsonArray[i].doctor_info;
                }
            }
        }
        else if(xhr.status !== 200)
        {
            console.log("didn't find rendezvous with id : " + id);
        }
    };

    xhr.open("GET", "DoctorRendezvous");
    xhr.send()
}

function UpdateRendezvous()
{
    document.getElementById("UpdateRendezvousLabel").innerHTML = '';


    let obj = new Object();
    obj.id = document.getElementById("rendezvous_id").value;
    obj.price = document.getElementById("rendezvous_price_update").value;
    obj.info = document.getElementById("rendezvous_textarea_update").value;

    let json = JSON.stringify(obj);
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            console.log("Rendezvous updated");
            document.getElementById("UpdateRendezvousLabel").innerHTML = 'Updated!';
            document.getElementById("UpdateRendezvousLabel").style.color = 'green';

        }
        else if(xhr.status !== 200)
        {
            document.getElementById("UpdateRendezvousLabel").innerHTML = 'Couldn\'t update :(';
            document.getElementById("UpdateRendezvousLabel").style.color = 'red';
        }
    };

    xhr.open("POST", "DoctorRendezvousUpdate");
    xhr.send(json)
}