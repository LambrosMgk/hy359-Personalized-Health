let username;

function getDoctor()
{
    username = localStorage.getItem("username");

    $("#ajaxContent2").append($("<header><h3>Welcome Dr." + username + "!</h3></header>"));
    //$("#ajaxContent2").append($("<header></header>").append($("<h3></h3>").text("Welcome Dr." + username + "!"))); old implementation a bit confusing
    //wrapped it in header so i can change the color a bit in the css
}

function EmptyScreen()
{
    $("#ajaxContent").empty();
    $("#ajaxContent2").empty();
    $("#ajaxContent3").empty();
    $("#ajaxContent2").append($("<header></header>").append($("<h3></h3>").text("Welcome Dr." + username + "!")));
}

function ShowUpdateForm()
{
    $("#ajaxContent").empty();
    $("#ajaxContent2").load("UpdateFormDoctor.html");
    $("#ajaxContent3").empty();
    GetDoctorData();
}

function ShowManageRendezvous()
{
    $("#ajaxContent").load("DoctorRendezvous.html", function () { SetCalendar(); });
    $("#ajaxContent2").load("DoctorRendezvousTable.html", function () { InitRendezvousTable(); });
    $("#ajaxContent3").load("DoctorRendezvousUpdate.html", function () {  });
}

function ShowCheckPatient()
{
    $("#ajaxContent").load("ShowPatients.html", function () {  });
    $("#ajaxContent2").load("ShowPatientsExams.html", function () {  });
    $("#ajaxContent3").empty();
}

function ShowTreatment()
{
    $("#ajaxContent").empty();
    $("#ajaxContent2").load("DoctorTreatment.html", function () {  });
    $("#ajaxContent3").empty();
}