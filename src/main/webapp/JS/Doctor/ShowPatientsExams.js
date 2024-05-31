"use strict";

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

var vitamind3 = [['Day', 'Vitamin D3', 'Normal level', 'High level']];
var vitaminb12 = [['Day', 'Vitamin B12', 'Normal level', 'High level']];
var cholesterol = [['Day', 'Cholesterol', 'High level']];
var blood_sugar = [['Day', 'Blood Sugar', 'Normal level', 'High level']];
var iron = [['Day', 'Iron', 'Normal level', 'High level']];


function drawChart(Values)
{
    var data = google.visualization.arrayToDataTable(Values);

    var options =
        {
            title: 'Exams Performance',
            curveType: 'function',
            legend: { position: 'bottom' },
            max: 300
        };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}

function getBloodTests()
{
    let id = document.getElementById("selected_id").value;
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        let table = document.getElementById("BloodTestTable");
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            //console.log(xhr.responseText);
            let jsonArray = JSON.parse(xhr.responseText);
            let body = document.getElementById("BloodTestTableBody");
            $("#BloodTestTableBody").empty();  //clear body before loading new content (otherwise content stacks up) (i include jquery in simpleuser)
            let row;
            for(let i = 0; i < jsonArray.length; i++)
            {
                row = body.insertRow(i);    // Create an empty <tr> element and add it to the i-st position of the table

                row.insertCell(0).innerHTML = jsonArray[i].bloodtest_id;
                row.insertCell(1).innerHTML = jsonArray[i].test_date;
                row.insertCell(2).innerHTML = jsonArray[i].medical_center;
                row.insertCell(3).innerHTML = jsonArray[i].vitamin_d3;
                row.insertCell(4).innerHTML = jsonArray[i].vitamin_d3_level;
                row.insertCell(5).innerHTML = jsonArray[i].vitamin_b12;
                row.insertCell(6).innerHTML = jsonArray[i].vitamin_b12_level;
                row.insertCell(7).innerHTML = jsonArray[i].cholesterol;
                row.insertCell(8).innerHTML = jsonArray[i].cholesterol_level;
                row.insertCell(9).innerHTML = jsonArray[i].blood_sugar;
                row.insertCell(10).innerHTML = jsonArray[i].blood_sugar_level;
                row.insertCell(11).innerHTML = jsonArray[i].iron;
                row.insertCell(12).innerHTML = jsonArray[i].iron_level;

                vitamind3[jsonArray.length-i] = [jsonArray[i].test_date, parseInt(jsonArray[i].vitamin_d3), 30, 150];
                vitaminb12[jsonArray.length-i] = [jsonArray[i].test_date, parseInt(jsonArray[i].vitamin_b12), 160, 925];
                cholesterol[jsonArray.length-i] = [jsonArray[i].test_date, parseInt(jsonArray[i].cholesterol), 200];
                blood_sugar[jsonArray.length-i] = [jsonArray[i].test_date, parseInt(jsonArray[i].blood_sugar), 70, 110];
                iron[jsonArray.length-i] = [jsonArray[i].test_date, parseInt(jsonArray[i].iron), 60, 150];
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

    xhr.open('POST', 'GetPatients');
    xhr.send(id);
}

function DrawVitamin_D3()
{
    //vitamind3.reverse() mas xalaei to ["day","value"] pou exw sthn arxh to paei sto telos kai den xerei meta ti na kanei
    //ta bazw mesa sto for loop apo panw me "swsth" seira
    drawChart(vitamind3);
}

function DrawVitamin_B12()
{
    drawChart(vitaminb12);
}

function DrawCholesterol()
{
    drawChart(cholesterol);
}

function DrawBlood_surar()
{
    drawChart(blood_sugar);
}

function DrawIron()
{
    drawChart(iron);
}