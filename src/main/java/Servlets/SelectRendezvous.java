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
import java.sql.SQLException;

@WebServlet(name = "SelectRendezvous", value = "/SelectRendezvous")
public class SelectRendezvous extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {

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
        String rendezvous_id = obj.get("rendezvous_id").getAsString();
        String user_id = obj.get("user_id").getAsString();
        System.out.println("Selecting rendezvous with id : " + rendezvous_id + " for user : " + user_id);
        try
        {
            int rv = DB_Connection.SelectRendezvous(rendezvous_id, user_id);
            response.setStatus(200);
            if(rv != 0)
            {
                response.getWriter().write("Rendezvous selected, affected rows : " + rv);
            }
            else
            {
                response.getWriter().write("Cannot select that");
            }
        } catch (SQLException | ClassNotFoundException e)
        {
            e.printStackTrace();
            response.setStatus(500);
        }
    }
}
