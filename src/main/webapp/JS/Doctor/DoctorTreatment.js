"use strict";

function CreateTreatment()
{
    let obj = {};
    obj.bloodtest_id = document.getElementById("bloodtestid").value;
    obj.start_date = document.getElementById("treatment_start_date").value;
    obj.end_date = document.getElementById("treatment_end_date").value;
    obj.treatment_text = document.getElementById("treatment_info").value;
    let json = JSON.stringify(obj);
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if(xhr.readyState === 4 && xhr.status === 200)
        {
            console.log("Treatment created!");
            document.getElementById("MakeTreatmentLabel").value = "Treatment created!";
        }
        else if (xhr.status !== 200)
        {
            console.log("Error, couldn't create treatment");
            document.getElementById("MakeTreatmentLabel").value = "Cound't make treatment :(";
        }
    };

    xhr.open("POST", "Treatment");
    xhr.send(json)
}