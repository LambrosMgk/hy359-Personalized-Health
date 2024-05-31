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

@WebServlet(name = "Users", value = "/Users")
public class Users extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        try
        {
            ResultSet rs = DB_Connection.GetAllUsers();
            JsonArray jsonArray = new JsonArray();
            while(rs.next())
            {
                JsonObject jsonObj = new JsonObject();
                jsonObj.addProperty("user_id", rs.getString("user_id"));
                jsonObj.addProperty("username", rs.getString("username"));
                jsonObj.addProperty("email", rs.getString("email"));
                jsonObj.addProperty("firstname", rs.getString("firstname"));
                jsonObj.addProperty("lastname", rs.getString("lastname"));
                jsonObj.addProperty("birthdate", rs.getString("birthdate"));
                jsonObj.addProperty("city", rs.getString("city"));
                jsonObj.addProperty("address", rs.getString("address"));
                jsonObj.addProperty("telephone", rs.getString("telephone"));
                jsonArray.add(jsonObj);
            }
            //System.out.println("json array : " + jsonArray);
            System.out.println("Sending all users");
            response.getWriter().write(String.valueOf(jsonArray));
            response.setStatus(200);
        }
        catch (SQLException | ClassNotFoundException e)
        {
            response.setStatus(500);
            e.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
