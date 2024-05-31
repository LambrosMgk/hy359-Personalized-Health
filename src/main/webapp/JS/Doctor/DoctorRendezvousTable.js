"use strict";

function DeleteRendezvous(id)
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            console.log("Delete successful");
            InitRendezvousTable();
        }
        else if (xhr.status !== 200)
        {
            console.log("Error with delete");
        }
    };

    xhr.open('POST', 'DeleteRendezvous');
    xhr.setRequestHeader("Content-type", "/DeleteRendezvous");
    xhr.send(id);
}

function CancelRendezvous(id)
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            InitRendezvousTable();
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

function InitRendezvousTable()  //maybe sort them too!
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        let table = document.getElementById("Rend_Table");
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let jsonArray = JSON.parse(xhr.responseText);
            let body = document.getElementById("Rend_Table_body");
            $("#Rend_Table_body").empty();  //clear body before loading new content
            let row, btn, cbtn;
            if(jsonArray.length === 0)
            {
                console.log("No rendezvous");
                row = body.insertRow(0);
                row.insertCell(0).innerHTML = 'No rendezvous';
            }
            for(let i = 0; i < jsonArray.length; i++)
            {
                btn = document.createElement('button');
                btn.type = "button";
                btn.id = "delete_rendezvous" + i;
                btn.className = "delete_btn";
                btn.innerHTML = "<i class=\"fa fa-trash-o\"></i>";
                btn.onclick = function ()
                {
                    let result = confirm("Want to delete?");
                    if (result)
                    {
                        console.log("Deleting rendezvous with id: " + jsonArray[i].randevouz_id);
                        DeleteRendezvous(jsonArray[i].randevouz_id);
                    }
                };

                cbtn = document.createElement('button');
                cbtn.type = "button";
                cbtn.id = "cancel_rendezvous" + i;
                cbtn.className = "delete_btn";
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

                row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table

                row.insertCell(0).appendChild(btn);
                row.insertCell(1).appendChild(cbtn);
                row.insertCell(2).innerHTML = jsonArray[i].status;
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
            let row = table.insertRow(0);
            let cell = row.insertCell(0);
            cell.innerHTML = xhr.responseText;
            console.log("Request failed, msg from server : " + xhr.responseText);
        }
    };

    xhr.open("GET", "DoctorRendezvous");
    xhr.send()
}

function resetRendezvous()
{
    document.getElementById("rend_date").innerHTML = "Viewing all rendezvous";
    InitRendezvousTable();
}

function getRendezvous()
{
    let year = document.getElementById("rend_year").value;
    let month = document.getElementById("rend_month").value;
    let day = document.getElementById("rend_day").value;

    const date = new Date(year, month-1, day);
    let m = date.toLocaleString('en-GB', { month: 'long' });
    document.getElementById("rend_date").innerHTML = "Viewing rendezvous for " + m +" " + day;

    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        let table = document.getElementById("Rend_Table");
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let jsonArray = JSON.parse(xhr.responseText);
            let body = document.getElementById("Rend_Table_body");
            $("#Rend_Table_body").empty();  //clear body before loading new content
            let row, btn, cbtn;
            if(jsonArray.length === 0)
            {
                console.log("No rendezvous");
                row = body.insertRow(0);
                row.insertCell(0).innerHTML = 'No rendezvous';
            }
            if(month < 10)
                month = "0" + month;
            if(day < 10)
                day = "0" + day;
            for(let i = 0; i < jsonArray.length; i++)
            {
                let dateYear = jsonArray[i].date_time[0] + jsonArray[i].date_time[1] + jsonArray[i].date_time[2] + jsonArray[i].date_time[3];
                let dateMonth = jsonArray[i].date_time[5] + jsonArray[i].date_time[6];
                let dateDay = jsonArray[i].date_time[8] + jsonArray[i].date_time[9];
                if(dateYear === year && dateMonth === month && dateDay === day)
                {
                    btn = document.createElement('button');
                    btn.type = "button";
                    btn.id = "delete_rendezvous" + i;
                    btn.className = "delete_btn";
                    btn.innerHTML = "<i class=\"fa fa-trash-o\"></i>";
                    btn.onclick = function ()
                    {
                        let result = confirm("Want to delete?");
                        if (result)
                        {
                            console.log("Deleting rendezvous with id: " + jsonArray[i].randevouz_id);
                            DeleteRendezvous(jsonArray[i].randevouz_id);
                        }
                    };

                    cbtn = document.createElement('button');
                    cbtn.type = "button";
                    cbtn.id = "cancel_rendezvous" + i;
                    cbtn.className = "delete_btn";
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

                    row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table

                    row.insertCell(0).appendChild(btn);
                    row.insertCell(1).appendChild(cbtn);
                    row.insertCell(2).innerHTML = jsonArray[i].status;
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
        }
        else if (xhr.status !== 200)
        {
            let row = table.insertRow(0);
            let cell = row.insertCell(0);
            cell.innerHTML = xhr.responseText;
            console.log("Request failed, msg from server : " + xhr.responseText);
        }
    };

    xhr.open("GET", "DoctorRendezvous");
    xhr.send()
}

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

function saveByteArray(reportName, byte) {
    var blob = new Blob([byte], {type: "application/pdf"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = reportName;
    link.download = fileName;
    link.click();
};

function makePdf()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            var sampleArr = base64ToArrayBuffer(xhr.response);
            saveByteArray("Rendezvous", sampleArr);
        }
        else if (xhr.status !== 200)
        {

        }
    };

    xhr.open("GET", "RendezvousToPdf");
    xhr.setRequestHeader("content-type", "application/pdf");
    xhr.send();
}