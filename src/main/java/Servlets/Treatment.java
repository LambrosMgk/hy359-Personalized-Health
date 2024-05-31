package Servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import database.DB_Connection;
import database.tables.EditBloodTestTable;
import database.tables.EditTreatmentTable;
import mainClasses.JSON_Converter;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(name = "Treatment", value = "/Treatment")
public class Treatment extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        //get treatment (because of time i assume that only 1 treatment will be active)
        HttpSession session = request.getSession();
        String username = null;
        if(session.getAttribute("loggedIn") != null)    //if logged in get username (he should be logged in but just in case)
        {
            username = session.getAttribute("loggedIn").toString();
        }
        else
        {
            response.getWriter().write("User not logged in");
            response.setStatus(204);    //not logged in
            return;
        }

        try
        {
            ResultSet rs = DB_Connection.getSimpleUser(username);
            if(rs.next())
            {
                ResultSet r = DB_Connection.GetTreatment(rs.getString("user_id"));
                JsonArray jsonArray = new JsonArray();
                while(r.next())
                {
                    JsonObject jsonObj = new JsonObject();
                    jsonObj.addProperty("treatment_id", r.getString("treatment_id"));
                    jsonObj.addProperty("doctor_id", r.getString("doctor_id")); //should replace this with doctor name
                    jsonObj.addProperty("start_date", r.getString("start_date"));
                    jsonObj.addProperty("end_date", r.getString("end_date"));
                    jsonObj.addProperty("treatment_text", r.getString("treatment_text"));
                    jsonObj.addProperty("bloodtest_id", r.getString("bloodtest_id"));
                    jsonArray.add(jsonObj);
                }
                response.getWriter().write(String.valueOf(jsonArray));
                response.setStatus(200);
            }
            else
            {
                System.out.println("Couldn't find user to get his id");
                response.setStatus(204);
            }
        }
        catch (SQLException | ClassNotFoundException e)
        {
            response.setStatus(500);
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        //create a treatment
        HttpSession session = request.getSession();
        String username, doctor_id = null;
        if(session.getAttribute("loggedIn") != null)    //if logged in get username (he should be logged in but just in case)
        {
            username = session.getAttribute("loggedIn").toString();
        }
        else
        {
            response.getWriter().write("Doctor not logged in");
            response.setStatus(204);    //not logged in
            return;
        }

        try
        {
            ResultSet rs = DB_Connection.getDoctor(username);
            if(rs.next())
            {
                doctor_id = rs.getString("doctor_id");
            }
            else
            {
                response.setStatus(204);    //couldn't find doctor??
                return;
            }
        }
        catch (SQLException | ClassNotFoundException e)
        {
            response.setStatus(500);
            e.printStackTrace();
            return;
        }

        String json = null;
        JSON_Converter converter = new JSON_Converter();
        BufferedReader reader = request.getReader();
        json = converter.getJSONFromAjax(reader);   //get the form in json
        System.out.println("BloodTestServlet : " + json);   //to check if json is alright

        JsonParser parser = new JsonParser();
        JsonObject obj = parser.parse(json).getAsJsonObject();
        mainClasses.Treatment trm = new mainClasses.Treatment();
        trm.setBloodtest_id(obj.get("bloodtest_id").getAsInt());
        ResultSet bt, usr;
        try
        {
            bt = DB_Connection.GetBloodTestById(obj.get("bloodtest_id").getAsString());
            if(bt.next())
            {
                usr = DB_Connection.Search_User_Table_withanyvalue("amka", bt.getString("amka"));
                if(usr.next())
                {
                    trm.setDoctor_id(Integer.parseInt(doctor_id));
                    trm.setUser_id(Integer.parseInt(usr.getString("user_id")));
                    trm.setStart_date(obj.get("start_date").getAsString());
                    trm.setEnd_date(obj.get("end_date").getAsString());
                    trm.setTreatment_text(obj.get("treatment_text").getAsString());
                    EditTreatmentTable ETT = new EditTreatmentTable();
                    ETT.createNewTreatment(trm);
                    response.setStatus(200);
                    return;
                }
            }
            response.setStatus(204);
        }
        catch (SQLException | ClassNotFoundException e)
        {
            response.setStatus(500);
            e.printStackTrace();
        }

    }
}
