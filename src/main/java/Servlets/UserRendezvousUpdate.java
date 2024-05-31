package Servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import database.DB_Connection;
import mainClasses.JSON_Converter;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(name = "UserRendezvousUpdate", value = "/UserRendezvousUpdate")
public class UserRendezvousUpdate extends HttpServlet {
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
            System.out.println("Get username to get rendezvous : " + username);

            try
            {
                ResultSet rs = DB_Connection.getSimpleUser(username);
                if(rs.next())
                {
                    String user_id = rs.getString("user_id");
                    ResultSet rendezvous = DB_Connection.GetUserSelectedRendezvous(user_id);
                    JsonArray jsonArray = new JsonArray();
                    while(rendezvous.next())
                    {
                        JsonObject jsonObj = new JsonObject();

                        jsonObj.addProperty("randevouz_id", rendezvous.getString("randevouz_id"));
                        jsonObj.addProperty("date_time", rendezvous.getString("date_time"));
                        jsonObj.addProperty("price", rendezvous.getString("price"));
                        jsonObj.addProperty("doctor_info", rendezvous.getString("doctor_info"));
                        jsonObj.addProperty("user_info", rendezvous.getString("user_info"));
                        jsonArray.add(jsonObj);
                    }
                    response.getWriter().write(String.valueOf(jsonArray));
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
                response.setStatus(500);
                response.getWriter().write("Server error");
                System.out.println("UserRendezvousUpdate GET : error");
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        String json = null;
        JSON_Converter converter = new JSON_Converter();
        BufferedReader reader = request.getReader();
        json = converter.getJSONFromAjax(reader);   //get the form in json
        JsonParser parser = new JsonParser();
        JsonObject obj = parser.parse(json).getAsJsonObject();

        try
        {   //the char ' messes up with SQL
            DB_Connection.UserUpdateRendezvous(obj.get("rendezvous_id").getAsString(), obj.get("info").getAsString().replaceAll("'", "\""));
            response.setStatus(200);
        }
        catch (SQLException | ClassNotFoundException e)
        {
            response.setStatus(500);
            e.printStackTrace();
        }
    }
}
