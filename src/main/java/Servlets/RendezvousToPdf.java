package Servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.codec.Base64;
import database.DB_Connection;
import org.apache.commons.io.FileUtils;


import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.File;
import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

import pdfConverter.PDFConverter;

@WebServlet(name = "RendezvousToPdf", value = "/RendezvousToPdf")
public class RendezvousToPdf extends HttpServlet {
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
            response.getWriter().write("User not logged in");
            response.setStatus(204);    //not logged in
            return;
        }

        try
        {
            ResultSet rs = DB_Connection.getDoctor(username);
            if(rs.next())
            {
                ResultSet r = DB_Connection.GetAllRendezvous(rs.getString("doctor_id"));
                JsonArray jsonArray = new JsonArray();
                while(r.next())
                {//rows
                    JsonObject jsonObj = new JsonObject();
                    jsonObj.addProperty("status", r.getString("status"));
                    jsonObj.addProperty("randevouz_id", r.getString("randevouz_id"));
                    jsonObj.addProperty("date_time", r.getString("date_time"));
                    jsonObj.addProperty("price", r.getString("price"));
                    jsonObj.addProperty("doctor_info", r.getString("doctor_info"));
                    jsonObj.addProperty("user_info", r.getString("user_info"));
                    jsonArray.add(jsonObj);
                }
                String[] header = new String[6];
                header[0] = "status";header[1] = "randevouz id";header[2] = "date-time";
                header[3] = "price";header[4] = "doctor info";header[5] = "user info";

                PDFConverter converter = new PDFConverter();
                converter.CreateTable("Rendezvous", header, 6, jsonArray);  //make it more dynamic in the future, like adding custom title of the rendezvous day etc
                File pdf = new File("..\\" + "Rendezvous.pdf");
                byte[] byteArray = FileUtils.readFileToByteArray(pdf);

                response.getWriter().print(Base64.encodeBytes(byteArray));
                response.setHeader("Content-Type", "application/pdf");
                response.setStatus(200);
            }
            else
            {
                System.out.println("Couldn't find doctor to get his id");
                response.setStatus(204);
            }
        }
        catch (SQLException | ClassNotFoundException | DocumentException e)
        {
            e.printStackTrace();
            response.setStatus(500);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {

    }
}
