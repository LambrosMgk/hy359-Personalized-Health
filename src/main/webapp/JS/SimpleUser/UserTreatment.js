"use strict";

$(document).ready(function ()
{
    getTreatment();
});

function getTreatment()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if(xhr.readyState === 4 && xhr.status === 200)
        {
            //console.log("Got treatment : " + xhr.responseText);
            let obj = JSON.parse(xhr.responseText);

            document.getElementById("treatmentid").value = obj[0].treatment_id;
            document.getElementById("treatment_start_date").value = obj[0].start_date;
            document.getElementById("treatment_end_date").value = obj[0].end_date;
            document.getElementById("treatment_info").value = obj[0].treatment_text;
            document.getElementById("bloodtestid").value = obj[0].bloodtest_id;
        }
        else if (xhr.status !== 200)
        {
            console.log("Error getting treatment");
        }
    };

    xhr.open("GET", "Treatment");
    xhr.send();
}