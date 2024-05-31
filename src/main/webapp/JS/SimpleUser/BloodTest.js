"use strict";

function AutoFillAmka()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let obj = JSON.parse(this.responseText);
            document.getElementById("amka").value = obj.amka;
        }
        else if (xhr.status !== 200)
        {
            console.log("probably didn't find user : " + this.responseText);
        }
    };
    console.log("Getting amka");
    xhr.open('GET', 'ChangeUserInfo');
    xhr.send();
}

function CheckBloodForm()
{
    let vitamin_d3 = document.getElementById("vitamin_d3").value;
    let vitamin_b12 = document.getElementById("vitamin_b12").value;
    let cholesterol = document.getElementById("cholesterol").value;
    let blood_sugar = document.getElementById("blood_sugar").value;
    let iron = document.getElementById("iron").value;

    return (vitamin_d3 || vitamin_b12 || cholesterol || blood_sugar || iron);   //if at least 1 of them has value it will return true
}

function CheckBloodTestDate()
{
    let date = document.getElementById("test_date").value;
    let today = new Date().toISOString().slice(0, 10);

    if(date > today)
    {
        return false;
    }

    return true;
}

function sendBloodTest()
{
    let label = document.getElementById("blood_label");
    label.innerHTML = "";
    label.style.color = 'red';
    if(!CheckBloodForm())
    {
        label.innerHTML = "Give at least 1 value";
        console.log("Give at least 1 value");
        return false;
    }
    else if(CheckBloodTestDate() === false)
    {
        label.innerHTML = "You can't submit a test with future date";
        console.log("You can't submit a test with future date");
        return false;
    }

    let myForm = document.getElementById('blood_work_form');
    let formData = new FormData(myForm);
    const data = {};
    formData.forEach((value, key) => (data[key] = value));
    let jsonData = JSON.stringify(data);

    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            console.log(xhr.responseText);
            document.getElementById('blood_work_form').reset();     //clear form like submit would do
            label.innerHTML = "Blood Test submitted";
            label.style.color = 'green';
        }
        else if (xhr.status !== 200)
        {
            console.log("Request failed, msg from server : " + xhr.responseText);
        }
    };

    xhr.open('POST', 'BloodTest');
    xhr.setRequestHeader("Content-type", "/BloodTest");
    xhr.send(jsonData);
}

function DeleteBloodTest(id)
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            console.log("Delete successful");
            GetBloodTests();
        }
        else if (xhr.status !== 200)
        {
            console.log("Error with delete");
        }
    };

    xhr.open('POST', 'DeleteBloodTest');
    xhr.setRequestHeader("Content-type", "/DeleteBloodTest");
    xhr.send(id);
}

function GetBloodTests()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        let table = document.getElementById("BloodTestTable");
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            let jsonArray = JSON.parse(xhr.responseText);
            let body = document.getElementById("BloodTestTableBody");
            $("#BloodTestTableBody").empty();  //clear body before loading new content (otherwise content stacks up) (i include jquery in simpleuser)
            let row, btn;
            for(let i = 0; i < jsonArray.length; i++)
            {
                btn = document.createElement('button');
                btn.type = "button";
                btn.id = "delete_test" + i;
                btn.className = "delete_btn";
                btn.innerHTML = "<i class=\"fa fa-trash-o\"></i>";
                btn.onclick = function ()
                {
                    console.log("Deleting test with id: " + jsonArray[i].bloodtest_id);
                    DeleteBloodTest(jsonArray[i].bloodtest_id);
                };

                row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table

                row.appendChild(btn);
                row.insertCell(0).innerHTML = jsonArray[i].test_date;
                row.insertCell(1).innerHTML = jsonArray[i].medical_center;
                row.insertCell(2).innerHTML = jsonArray[i].vitamin_d3;
                row.insertCell(3).innerHTML = jsonArray[i].vitamin_d3_level;
                row.insertCell(4).innerHTML = jsonArray[i].vitamin_b12;
                row.insertCell(5).innerHTML = jsonArray[i].vitamin_b12_level;
                row.insertCell(6).innerHTML = jsonArray[i].cholesterol;
                row.insertCell(7).innerHTML = jsonArray[i].cholesterol_level;
                row.insertCell(8).innerHTML = jsonArray[i].blood_sugar;
                row.insertCell(9).innerHTML = jsonArray[i].blood_sugar_level;
                row.insertCell(10).innerHTML = jsonArray[i].iron;
                row.insertCell(11).innerHTML = jsonArray[i].iron_level;
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

    xhr.open('GET', 'BloodTest');
    xhr.send();
}

