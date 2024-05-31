"use strict";

String.prototype.replaceAt = function(index, replacement) //just so i can change a char in the string for max date
{
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

function SetCalendar()
{
    let calendar = document.getElementById("rendezvous_date_time");

    calendar.min = new Date().toISOString().split(".")[0];  //set the minimum day for today
    let maxdate = new Date().toISOString().split(".")[0];
    let change = maxdate.charAt(3);     //set the max till the next year i guess
    change = (parseInt(change) + 1).toString();
    calendar.max = maxdate.replaceAt(3, change);
}

function CheckTime(hour, minute)
{
    if(hour < 8)
    {
        return false;
    }
    else if(hour == 20 && minute > 30)
    {
        return false;
    }
    else if(hour > 20)
    {
        return false;
    }
    return true;
}

function GetCalendar()
{
    let calendar = document.getElementById("rendezvous_date_time");
    //let year = calendar.value[0] + calendar.value[1] + calendar.value[2] + calendar.value[3];
    let month = calendar.value[5] + calendar.value[6];
    let day = calendar.value[8] + calendar.value[9];
    let hour = calendar.value[11] + calendar.value[12];
    let minute = calendar.value[14] + calendar.value[15];

    if(CheckTime(hour, minute))
    {
        document.getElementById('rendezvous_label').innerHTML = 'You picked : ' + day + '/' + month + " at " + hour + ":" + minute;
    }
    else
    {
        document.getElementById('rendezvous_label').innerHTML = 'Time must be between 8:00 and 20:30';
    }
}

function MakeRendezvous()
{
    document.getElementById("MakeRendezvousLabel").innerHTML = '';

    let calendar = document.getElementById("rendezvous_date_time");
    let year = calendar.value[0] + calendar.value[1] + calendar.value[2] + calendar.value[3];
    let month = calendar.value[5] + calendar.value[6];
    let day = calendar.value[8] + calendar.value[9];
    let hour = calendar.value[11] + calendar.value[12];
    let minute = calendar.value[14] + calendar.value[15];

    if(isNaN(year) || isNaN(month) || isNaN(hour))   //i don't think i need to check the rest this is already enough
    {
        return;
    }
    if(CheckTime(hour, minute) === false)
    {
        document.getElementById('rendezvous_label').innerHTML = 'Time must be between 8:00 and 20:30';
        return;
    }

    let obj = new Object();
    obj.date_time = calendar.value;
    obj.price = document.getElementById("rendezvous_price").value;
    obj.info = document.getElementById("rendezvous_textarea").value;
    let json = JSON.stringify(obj);
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if(xhr.readyState === 4 && xhr.status === 200)
        {
            document.getElementById("MakeRendezvousLabel").style.color = 'green';
            document.getElementById("MakeRendezvousLabel").innerHTML = 'Rendezvous created!';
        }
        else if (xhr.status !== 200)
        {
            document.getElementById("MakeRendezvousLabel").style.color = 'red';
            document.getElementById("MakeRendezvousLabel").innerHTML = 'Problem with creating the rendezvous.';
        }
    };

    xhr.open("POST", "DoctorRendezvous");
    xhr.send(json);
}