package Servlets;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import database.DB_Connection;
import mainClasses.JSON_Converter;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(name = "ChangeUserInfo", value = "/ChangeUserInfo")
public class ChangeUserInfo extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        HttpSession session = request.getSession(false);

        if(session == null)
        {
            System.out.println("User is not logged in");
            response.setStatus(403);
            response.getWriter().write("Server : user not logged in");
        }
        else
        {
            String username = session.getAttribute("loggedIn").toString();
            System.out.println("Get user info : " + username);

            try
            {
                ResultSet rs = DB_Connection.getSimpleUser(username);
                if(rs.next())
                {
                    JsonObject jsonObj = new JsonObject();
                    jsonObj.addProperty("username", rs.getString("username"));
                    jsonObj.addProperty("email", rs.getString("email"));
                    jsonObj.addProperty("firstname", rs.getString("firstname"));
                    jsonObj.addProperty("lastname", rs.getString("lastname"));
                    jsonObj.addProperty("birthdate", rs.getString("birthdate"));
                    jsonObj.addProperty("gender", rs.getString("gender"));
                    jsonObj.addProperty("amka", rs.getString("amka"));
                    jsonObj.addProperty("country", rs.getString("country"));
                    jsonObj.addProperty("city", rs.getString("city"));
                    jsonObj.addProperty("address", rs.getString("address"));
                    jsonObj.addProperty("telephone", rs.getString("telephone"));
                    jsonObj.addProperty("height", rs.getString("height"));
                    jsonObj.addProperty("weight", rs.getString("weight"));
                    jsonObj.addProperty("blooddonor", rs.getString("blooddonor"));
                    jsonObj.addProperty("bloodtype", rs.getString("bloodtype"));
                    jsonObj.addProperty("lat", rs.getString("lat"));    //added lat lon id for FindDoctorsForUser.js
                    jsonObj.addProperty("lon", rs.getString("lon"));
                    jsonObj.addProperty("user_id", rs.getString("user_id"));
                    //System.out.println("json object : " + jsonObj);
                    response.getWriter().write(String.valueOf(jsonObj));
                    response.setStatus(200);
                }
                else
                {
                    response.setStatus(403);
                    response.getWriter().write("Server : didn't find user");
                }

            }
            catch(SQLException | ClassNotFoundException e)
            {
                response.setStatus(403);
                response.getWriter().write("Server : didn't find user");
                System.out.println("ChangeUserInfo GET : error");
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setHeader("Content-Type", "text/plain");
        PrintWriter writer = response.getWriter();

        String json = null;
        JSON_Converter converter = new JSON_Converter();
        BufferedReader reader = request.getReader();
        json = converter.getJSONFromAjax(reader);   //get the form in json
        System.out.println("ChangeUserInfo : " + json);   //to check if json is alright

        JsonParser parser = new JsonParser();
        JsonObject obj = parser.parse(json).getAsJsonObject();
        try
        {
            DB_Connection.UpdateSimpleUser(obj.get("username").getAsString()
                    , obj.get("email").getAsString(), obj.get("password").getAsString(), obj.get("firstname").getAsString(), obj.get("lastname").getAsString()
                    , obj.get("birthdate").getAsString(), obj.get("gender").getAsString(), obj.get("country").getAsString(), obj.get("city").getAsString()
                    , obj.get("address").getAsString(), obj.get("telephone").getAsString(), obj.get("height").getAsString(), obj.get("weight").getAsString()
                    , obj.get("blooddonor").getAsString(), obj.get("bloodtype").getAsString());

            writer.write("Update successful");
            response.setStatus(200);
        }
        catch(SQLException | ClassNotFoundException e)
        {
            System.out.println("Error updating user...");
            writer.write("Error updating user...");
            response.setStatus(500);
            e.printStackTrace();
        }
    }
}
