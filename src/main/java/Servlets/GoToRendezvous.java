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

@WebServlet(name = "GoToRendezvous", value = "/GoToRendezvous")
public class GoToRendezvous extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        //get done rendezvous
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
            try
            {
                ResultSet rs = DB_Connection.getSimpleUser(username);
                if(rs.next())
                {
                    String user_id = rs.getString("user_id");
                    ResultSet rendezvous = DB_Connection.GetUserDoneRendezvous(user_id);
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
                System.out.println("GoToRendezvous GET : error");
                e.printStackTrace();
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        String rendezvous_id =  request.getReader().readLine();

        try
        {
            DB_Connection.UserGoToRendezvous(rendezvous_id);
            response.setStatus(200);
        }
        catch (SQLException | ClassNotFoundException e)
        {
            response.setStatus(500);
            e.printStackTrace();
        }
    }
}
