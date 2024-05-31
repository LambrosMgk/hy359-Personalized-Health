package Servlets;

import database.DB_Connection;
import database.tables.EditBloodTestTable;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "DeleteBloodTest", value = "/DeleteBloodTest")
public class DeleteBloodTest extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setHeader("Content-Type", "text/plain");
        PrintWriter writer = response.getWriter();

        String id =  request.getReader().readLine();
        System.out.println("Deleting test with id: " + id);
        try
        {
            EditBloodTestTable btt = new EditBloodTestTable();
            btt.deleteBloodTest(Integer.parseInt(id));
            response.setStatus(200);
            writer.write("Delete was successful");
        }
        catch (SQLException | ClassNotFoundException e)
        {
            System.out.println("Error with deleting blood test with id " + id);
            e.printStackTrace();
            response.setStatus(403);
            writer.write("Error with deleting blood test");
        }
        catch(NumberFormatException e)
        {
            System.out.println("Error with converting string to int");
            e.printStackTrace();
            response.setStatus(403);
        }
    }
}
