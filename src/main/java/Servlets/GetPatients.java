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

@WebServlet(name = "GetPatients", value = "/GetPatients")
public class GetPatients extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
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
                ResultSet r = DB_Connection.GetDoctorDoneRendezvous(rs.getString("doctor_id"));
                JsonArray jsonArray = new JsonArray();
                while(r.next())
                {
                    ResultSet s = DB_Connection.getSimpleUserById(r.getString("user_id"));
                    while (s.next())
                    {
                        JsonObject jsonObj = new JsonObject();
                        jsonObj.addProperty("user_id", s.getString("user_id"));
                        jsonObj.addProperty("firstname", s.getString("firstname"));
                        jsonObj.addProperty("lastname", s.getString("lastname"));
                        jsonArray.add(jsonObj);
                    }
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
        //send blood tests based on given id

        String id = request.getReader().readLine();
        System.out.println("Sending blood tests from user with id: " + id);
        try
        {
            ResultSet rs = DB_Connection.getSimpleUserById(id);
            if(rs.next())   // if user exists
            {
                ResultSet rs2 = DB_Connection.GetBloodTests(rs.getString("amka"));
                JsonArray jsonArray = new JsonArray();
                while(rs2.next())   //get all tests
                {
                    JsonObject jsonObj = new JsonObject();
                    jsonObj.addProperty("bloodtest_id", rs2.getString("bloodtest_id"));
                    jsonObj.addProperty("test_date", rs2.getString("test_date"));
                    jsonObj.addProperty("medical_center", rs2.getString("medical_center"));
                    jsonObj.addProperty("vitamin_d3", rs2.getString("vitamin_d3"));
                    jsonObj.addProperty("vitamin_d3_level", rs2.getString("vitamin_d3_level"));
                    jsonObj.addProperty("vitamin_b12", rs2.getString("vitamin_b12"));
                    jsonObj.addProperty("vitamin_b12_level", rs2.getString("vitamin_b12_level"));
                    jsonObj.addProperty("cholesterol", rs2.getString("cholesterol"));
                    jsonObj.addProperty("cholesterol_level", rs2.getString("cholesterol_level"));
                    jsonObj.addProperty("blood_sugar", rs2.getString("blood_sugar"));
                    jsonObj.addProperty("blood_sugar_level", rs2.getString("blood_sugar_level"));
                    jsonObj.addProperty("iron", rs2.getString("iron"));
                    jsonObj.addProperty("iron_level", rs2.getString("iron_level"));
                    jsonArray.add(jsonObj);
                }
                //System.out.println("json array : " + jsonArray);
                response.getWriter().write(String.valueOf(jsonArray));
                response.setStatus(200);
            }
            else
            {
                System.out.println("Cant find logged in user");
                response.setStatus(403);
                response.getWriter().write("Can't find user");
            }
        }
        catch(SQLException | ClassNotFoundException e)
        {
            System.out.println("Error getting blood tests");
            response.getWriter().write("Error getting blood tests");
            response.setStatus(500);
            e.printStackTrace();
        }
    }
}
