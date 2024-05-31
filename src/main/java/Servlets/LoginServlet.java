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

@WebServlet(name = "LoginServlet", value = "/LoginServlet")
public class LoginServlet extends HttpServlet
{
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        HttpSession session = request.getSession();
        JsonObject jsonObj = new JsonObject();

        if(session.getAttribute("loggedIn") != null)    //if logged in send back the username and if its a user or doctor
        {
            jsonObj.addProperty("username", session.getAttribute("loggedIn").toString());
            jsonObj.addProperty("href", session.getAttribute("href").toString().replace("\"", "")); //remove the \" chars at start and end of string, the ruin the href
            System.out.println("Already logged in, href : " + jsonObj.get("href"));
            response.setStatus(200);
            response.getWriter().write(String.valueOf(jsonObj));
        }
        else
        {
            jsonObj.addProperty("responseText", "No user logged in");
            response.getWriter().write(String.valueOf(jsonObj));
            response.setStatus(204);    //no content (not logged in)
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

        JsonParser parser = new JsonParser();
        JsonObject obj = parser.parse(json).getAsJsonObject();
        String username = obj.get("username").getAsString();    //get username password
        String password = obj.get("password").getAsString();
        HttpSession session = request.getSession(true); //session object


        try
        {
            ResultSet rs = DB_Connection.getPasswordUser(username);
            ResultSet rs2 = DB_Connection.getPasswordDoctor(username);  //searches only certified doctors

            Boolean r = rs.next();
            Boolean r2 = rs2.next();
            JsonObject jsonObj = new JsonObject();

            if(!r && !r2)
            {
                //no user
                jsonObj.addProperty("responseText", "Wrong Credentials");
                writer.write(String.valueOf(jsonObj));
                response.setStatus(401);    //unauthorized
            }
            else
            {
                String userpassword, type;
                if(r)       //if it's a simple user (or admin)
                {
                    userpassword = rs.getString("password");
                    type = "user";
                    if(username.contentEquals("admin"))
                    {
                        type = "admin";
                        jsonObj.addProperty("href", "http://localhost:8080/Health_Project_war_exploded/admin.html");
                    }
                    else
                        jsonObj.addProperty("href", "http://localhost:8080/Health_Project_war_exploded/SimpleUser.html");
                }
                else        //else it's a doctor
                {
                    userpassword = rs2.getString("password");
                    type = "doctor";
                    jsonObj.addProperty("href", "http://localhost:8080/Health_Project_war_exploded/Doctor.html");
                }


                if(password.contentEquals(userpassword))    //check if passwords match
                {
                    session.setAttribute("loggedIn", username);
                    session.setAttribute("Type", type);
                    session.setAttribute("href", jsonObj.get("href"));
                    //session.setMaxInactiveInterval(300); 5 minutes
                    jsonObj.addProperty("responseText", "Logged in as " + username + ".");
                    jsonObj.addProperty("username", username);
                    System.out.println("Logged in as " + username + ".");
                    writer.write(String.valueOf(jsonObj));
                    response.setStatus(200);
                }
                else
                {   //maybe invalidate session object?
                    jsonObj.addProperty("responseText", "Wrong Credentials");
                    writer.write(String.valueOf(jsonObj));
                    response.setStatus(401);
                }
            }
        }
        catch(ClassNotFoundException s)
        {
            System.out.println("Login Class error");
            s.printStackTrace();
        }
        catch(SQLException s)
        {
            System.out.println("Login SQL error");
            s.printStackTrace();
        }
    }
}
