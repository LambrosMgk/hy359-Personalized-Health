package Servlets;

import com.google.gson.JsonArray;
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


@WebServlet(name = "Check_user_form", value = "/Check_user_form")
public class Check_user_form extends HttpServlet {
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

        json = converter.getJSONFromAjax(reader);   //get json
        System.out.println("check_from_user json : " + json);
        JsonParser parser = new JsonParser();
        JsonArray obj = parser.parse(json).getAsJsonArray();
        String choice = obj.get(0).getAsString();
        String value = obj.get(1).getAsString();
        //System.out.println("choice : " + choice + ", value : " + value);

        try
        {
            ResultSet rs = DB_Connection.Search_User_Table(choice, value);

            if(!rs.next())//check users table first
            {
                ResultSet rs2 = DB_Connection.Search_Doctor_Table(choice, value);
                if(!rs2.next())//then check doctors table
                {
                    writer.write(choice + " unique");
                    response.setStatus(200); // no users with that "value"
                }
                else
                {
                    writer.write(choice + " is already in use");
                    response.setStatus(403);
                }
            }
            else
            {
                writer.write(choice + " is already in use");
                response.setStatus(403);
            }
            writer.close();
            //con.close();
            //stmt.close();
        }
        catch(SQLException s)
        {
            System.out.println("Check_user_form : SQL Exception");
        }
        catch(ClassNotFoundException s)
        {
            System.out.println("Check_user_form : ClassnotFound Exception");
        }
    }
}
