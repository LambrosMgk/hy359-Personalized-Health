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

@WebServlet(name = "GetRendezvous", value = "/GetRendezvous")
public class GetRendezvous extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        String doctor_id =  request.getReader().readLine();     //get all the free rendezvous of a doctor
        System.out.println("Getting Rendezvous of doctor with id: " + doctor_id);   //we assume doctor is verified

        try
        {
            ResultSet r = DB_Connection.GetAllRendezvous(doctor_id);
            JsonArray jsonArray = new JsonArray();
            while (r.next())
            {
                JsonObject jsonObj = new JsonObject();
                if(r.getString("status").contentEquals("free")) //if its free add it to the list
                {
                    jsonObj.addProperty("status", r.getString("status"));
                    jsonObj.addProperty("randevouz_id", r.getString("randevouz_id"));
                    jsonObj.addProperty("date_time", r.getString("date_time"));
                    jsonObj.addProperty("price", r.getString("price"));
                    jsonObj.addProperty("doctor_info", r.getString("doctor_info"));
                    //jsonObj.addProperty("user_info", r.getString("user_info"));
                    jsonArray.add(jsonObj);
                }
            }
            response.getWriter().write(String.valueOf(jsonArray));
            response.setStatus(200);
        }
        catch (SQLException | ClassNotFoundException e)
        {
            response.setStatus(500);
            e.printStackTrace();
        }
    }
}
