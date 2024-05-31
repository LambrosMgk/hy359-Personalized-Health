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

@WebServlet(name = "RendezvousCancel", value = "/RendezvousCancel")
public class RendezvousCancel extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        //Cancel function checks if its selected and then cancel, this servlet can be called from both the user and the doctor
        String id =  request.getReader().readLine();
        System.out.println("Canceling Rendezvous with id: " + id);
        try
        {
            DB_Connection.CancelRendezvous(id);
            response.setStatus(200);
        }
        catch (SQLException | ClassNotFoundException e)
        {
            e.printStackTrace();
            response.setStatus(500);
        }
    }
}
