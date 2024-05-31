package Servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import database.DB_Connection;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(name = "VerifiedDoctors", value = "/VerifiedDoctors")
public class VerifiedDoctors extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        //get all the verified doctors
        try
        {
            ResultSet rs = DB_Connection.GetAllVerifiedDoctors();
            JsonArray jsonArray = new JsonArray();
            while(rs.next())
            {
                JsonObject jsonObj = new JsonObject();
                jsonObj.addProperty("doctor_id", rs.getString("doctor_id"));
                jsonObj.addProperty("firstname", rs.getString("firstname"));
                jsonObj.addProperty("lastname", rs.getString("lastname"));
                jsonObj.addProperty("country", rs.getString("country"));
                jsonObj.addProperty("city", rs.getString("city"));
                jsonObj.addProperty("address", rs.getString("address"));
                jsonObj.addProperty("telephone", rs.getString("telephone"));
                jsonObj.addProperty("specialty", rs.getString("specialty"));
                jsonObj.addProperty("lat", rs.getString("lat"));    //added lat lon for FindDoctorsForUser.js
                jsonObj.addProperty("lon", rs.getString("lon"));
                jsonArray.add(jsonObj);
            }
            //System.out.println("json array : " + jsonArray);
            System.out.println("Sending verified doctors");
            response.getWriter().write(String.valueOf(jsonArray));
            response.setStatus(200);
        }
        catch (SQLException | ClassNotFoundException e)
        {
            System.out.println("Verified Doctors error");
            response.setStatus(500);
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {

    }
}
