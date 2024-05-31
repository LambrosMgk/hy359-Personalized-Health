package Servlets;

import database.tables.EditBloodTestTable;
import database.tables.EditRandevouzTable;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

@WebServlet(name = "DeleteRendezvous", value = "/DeleteRendezvous")
public class DeleteRendezvous extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setHeader("Content-Type", "text/plain");
        PrintWriter writer = response.getWriter();

        String id =  request.getReader().readLine();
        System.out.println("Deleting Rendezvous with id: " + id);
        try
        {
            EditRandevouzTable RT = new EditRandevouzTable();
            RT.deleteRandevouz(Integer.parseInt(id));
            response.setStatus(200);
            writer.write("Delete was successful");
        }
        catch (SQLException | ClassNotFoundException e)
        {
            System.out.println("Error with deleting rendezvous with id " + id);
            e.printStackTrace();
            response.setStatus(403);
            writer.write("Error with deleting rendezvous");
        }
        catch(NumberFormatException e)
        {
            System.out.println("Error with converting string to int");
            e.printStackTrace();
            response.setStatus(403);
        }
    }
}
