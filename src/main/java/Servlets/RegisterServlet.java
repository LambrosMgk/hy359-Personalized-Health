package Servlets;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.BufferedReader;
import java.io.IOException;

import java.io.PrintWriter;
import database.DB_Connection;
import mainClasses.*;
import database.tables.*;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


@WebServlet(name = "RegisterServlet", value = "/RegisterServlet")
public class RegisterServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {

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
        //System.out.println("RegisterServlet : " + json);   //to check if json is alright

        JsonParser parser = new JsonParser();
        JsonObject obj = parser.parse(json).getAsJsonObject();
        String choice = obj.get("user_select").getAsString();   //user selection (user or doctor)



        //check if user is already in the database
        String username = obj.get("username").getAsString(),
                email = obj.get("email").getAsString(),
                amka = obj.get("amka").getAsString();
        if(DB_Connection.Search_user_unique(username, email, amka) == 1)//no such user in database
        {
            if("User".contentEquals(choice))//or i can make 2 servlets : RegisterUser and RegisterDoc and call them with js
            {
                EditSimpleUserTable usertable = new EditSimpleUserTable();
                try
                {
                    usertable.addSimpleUserFromJSON(json);  //could add a random user id (it adds user ids incrementally by itself)
                    writer.write("Registration complete!");
                    response.setStatus(200);//Successful Registration.
                }
                catch(ClassNotFoundException e)
                {
                    System.out.println("RegisterServlet : Class not found");
                    e.printStackTrace();
                    //maybe send msg back to the client about the error?
                }
            }
            else if("Doctor".contentEquals(choice)) //implement doctor
            {
                try
                {
                    EditDoctorTable dtbl = new EditDoctorTable();
                    dtbl.addDoctorFromJSON(json);
                    writer.write("Registration complete, but you have to get verified by an admin.");
                    response.setStatus(200);//Successful Registration.
                }
                catch(ClassNotFoundException s)
                {
                    System.out.println("Doctor error");
                    s.printStackTrace();
                }

            }
            else
            {
                writer.write("Internal server error");
                response.setStatus(500);//Failed Registration.
                System.out.println(" failed " + choice);
            }
        }
        else
        {
            writer.write("User already exists with those credentials");
            response.setStatus(500);//Failed Registration.
            System.out.println("User already exists");
        }

        writer.close();
    }
}
