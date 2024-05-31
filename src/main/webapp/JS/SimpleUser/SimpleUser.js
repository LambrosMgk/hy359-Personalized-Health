"use strict";

var username;

function getUser()
{
    username = localStorage.getItem("username");

    $("#ajaxContent").append($("<h3></h3>").text("Welcome " + username + "!"));
}

function EmptyScreen()
{
    $("#ajaxContent").empty();
    $("#ajaxContent2").empty();
    $("#ajaxContent").append($("<h3></h3>").text("Welcome " + username + "!"));
    checkActiveRendezvous();
    //check active rendezvous and alert user if there is one in the next 4 hours
}

function showDataForm()
{
    $("#ajaxContent").load("UpdateForm.html", function () { GetData(); });
    $("#ajaxContent2").empty();
}

function showBloodTestForm()
{
    $("#ajaxContent").load("BloodTest.html", function () { AutoFillAmka(); });
    $("#ajaxContent2").load("BloodTestTable.html");
}

function showCompareExamsForm()
{
    $("#ajaxContent").load("ExamsCompare.html", function () { getBloodTests(); });
    $("#ajaxContent2").load("UserTreatment.html");
}

function showFindDoctorsForm()
{
    $.getScript("JS/SimpleUser/FindDoctorsForUser.js", function () { });
    $.getScript("JS/fix_for_openlayer.js");
    $("#ajaxContent").load("UserMapWithDoctors.html"); //map for the doctors
    $("#ajaxContent2").load("UserDoctorList.html");
}

function showRendezvous()
{
    $("#ajaxContent").load("UserRendezvous.html", function () { getActiveRendezvous(); });
    $("#ajaxContent2").load("UserDoneRendezvous.html", function () { getDoneRendezvous(); });
    //will show Rendezvous history and active rendezvous
    //options to actually "go" to the rendezvous changing it to "done" so doc can see the blood tests and assign a treatment
}

function checkActiveRendezvous()
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function ()
    {
        if(xhr.readyState === 4 && xhr.status === 200)
        {
            let jsonArray = JSON.parse(this.responseText);

            if(jsonArray.length === 0)
            {
                console.log("you don't have active rendezvous");
                //make an element and put it on page?
            }

            for(let i = 0; i < jsonArray.length; i++)
            {
                let date = new Date().toISOString().split(".")[0];
                let year = date[0] + date[1] + date[2] + date[3];
                let month = date[5] + date[6];
                let day = date[8] + date[9];
                let hour = date[11] + date[12];
                //let minute = date[14] + date[15];
                $("#ajaxContent").append($("<div id='reminder" + i + "'></div>"));
                let dateYear = jsonArray[i].date_time[0] + jsonArray[i].date_time[1] + jsonArray[i].date_time[2] + jsonArray[i].date_time[3];
                let dateMonth = jsonArray[i].date_time[5] + jsonArray[i].date_time[6];
                let dateDay = jsonArray[i].date_time[8] + jsonArray[i].date_time[9];
                let datehour = jsonArray[i].date_time[11] + jsonArray[i].date_time[12];

                if(dateYear === year && dateMonth === month && dateDay === day && (datehour - hour <= 4) && (datehour - hour >= 0)) // >=0 checks if its passed time for the rendezvous
                {
                    console.log("Don't miss rendezvous with id : " + jsonArray[i].randevouz_id);

                    $("#reminder" + i).append("<h4>Don't be late for your rendezvous with id : " + jsonArray[i].randevouz_id +
                        "<br> time remaining " + (datehour - hour) +" hours</h4>");
                }
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

function Check_BMI()
{
    let age = document.getElementById("Age").value;
    let height = document.getElementById("BMI_Height").value;
    let weight = document.getElementById("BMI_Weight").value;

    const xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function ()
    {
        if (this.readyState === this.DONE)
        {
            console.log(this.responseText);
            let obj = JSON.parse(this.responseText);

            document.getElementById("bmi_result").innerHTML = "Your BMI is : " + obj.data.bmi
                + "<br>" + obj.data.health + " (Health bmi range :" + obj.data.healthy_bmi_range + ")";
        }
    });

    xhr.open("GET", "https://fitness-calculator.p.rapidapi.com/bmi?age=" + age + "&weight=" + weight + "&height=" + height);
    xhr.setRequestHeader("x-rapidapi-host", "fitness-calculator.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "16da386f64msh58b0e49ff139f9ep1d0c30jsnba3308bb72fb");

    xhr.send();
}

function get_ideal_weight()
{
    let gender = document.querySelector('input[name="iw_gender"]:checked').value;
    let height = document.getElementById("iw_Height").value;

    const xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;
    xhr.addEventListener("readystatechange", function ()
    {
        if (this.readyState === this.DONE)
        {
            console.log(this.responseText);
            let obj = JSON.parse(this.responseText);
            document.getElementById("iw_label").innerHTML = "Hamwi : " + obj.data.Hamwi + " Devine : " + obj.data.Devine + " Miller : "
                + obj.data.Miller + " Robinson : " + obj.data.Robinson;
        }
    }
    );

    xhr.open("GET", "https://fitness-calculator.p.rapidapi.com/idealweight?gender=" + gender + "&height=" + height);
    xhr.setRequestHeader("x-rapidapi-host", "fitness-calculator.p.rapidapi.com");
    xhr.setRequestHeader("x-rapidapi-key", "16da386f64msh58b0e49ff139f9ep1d0c30jsnba3308bb72fb");

    xhr.send();
}