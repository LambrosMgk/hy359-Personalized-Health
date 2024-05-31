package Servlets;

import database.DB_Connection;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet(name = "DeleteUser", value = "/DeleteUser")
public class DeleteUser extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        //delete user with given id
        String id =  request.getReader().readLine();
        System.out.println("Deleting user with id: " + id);
        try
        {
            DB_Connection.DeleteUser(id);
            response.setStatus(200);
        }
        catch (SQLException | ClassNotFoundException e)
        {
            e.printStackTrace();
            response.setStatus(500);
        }
    }
}
