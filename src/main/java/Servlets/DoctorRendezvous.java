package Servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import database.DB_Connection;
import database.tables.EditRandevouzTable;
import mainClasses.JSON_Converter;
import mainClasses.Randevouz;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(name = "DoctorRendezvous", value = "/DoctorRendezvous")
public class DoctorRendezvous extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        //return all the rendezvous
        HttpSession session = request.getSession();
        String username = null;
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
                ResultSet r = DB_Connection.GetAllRendezvous(rs.getString("doctor_id"));
                JsonArray jsonArray = new JsonArray();
                while(r.next())
                {
                    JsonObject jsonObj = new JsonObject();
                    jsonObj.addProperty("status", r.getString("status"));
                    jsonObj.addProperty("randevouz_id", r.getString("randevouz_id"));
                    jsonObj.addProperty("date_time", r.getString("date_time"));
                    jsonObj.addProperty("price", r.getString("price"));
                    jsonObj.addProperty("doctor_info", r.getString("doctor_info"));
                    jsonObj.addProperty("user_info", r.getString("user_info"));
                    jsonArray.add(jsonObj);
                }
                response.getWriter().write(String.valueOf(jsonArray));
                response.setStatus(200);
            }
            else
            {
                System.out.println("Couldn't find doctor to get his id");
                response.setStatus(204);
            }
        }
        catch (SQLException | ClassNotFoundException e)
        {
            e.printStackTrace();
            response.setStatus(500);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setHeader("Content-Type", "text/plain");
        //PrintWriter writer = response.getWriter();

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


        JSON_Converter converter = new JSON_Converter();
        BufferedReader reader = request.getReader();
        String json = converter.getJSONFromAjax(reader);   //get the form in json
        System.out.println("DoctorRendezvous : " + json);   //to check if json is alright

        JsonParser parser = new JsonParser();
        JsonObject obj = parser.parse(json).getAsJsonObject();

        Randevouz r = new Randevouz();
        r.setPrice(obj.get("price").getAsInt());
        r.setDate_time(obj.get("date_time").getAsString());
        System.out.println(obj.get("info").getAsString());
        r.setDoctor_info(obj.get("info").getAsString());
        r.setStatus("free");
        EditRandevouzTable RT = new EditRandevouzTable();
        try
        {
            ResultSet rs = DB_Connection.getDoctor(username);
            if(rs.next())
            {
                r.setDoctor_id(Integer.parseInt(rs.getString("doctor_id")));
                RT.createNewRandevouz(r);
                response.setStatus(200);
            }
            else
            {
                System.out.println("Couldn't find doctor to get his id");
                response.setStatus(204);
            }
        }
        catch(ClassNotFoundException | SQLException | NumberFormatException e)
        {
            System.out.println("Error while creating rendezvous");
            response.setStatus(500);
            e.printStackTrace();
        }
    }
}
