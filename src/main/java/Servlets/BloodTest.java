package Servlets;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import database.DB_Connection;
import database.tables.EditBloodTestTable;
import mainClasses.JSON_Converter;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(name = "BloodTest", value = "/BloodTest")
public class BloodTest extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        //get all tests with user's amka
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
            //System.out.println("Get blood tests username : " + username);

            try
            {
                ResultSet rs = DB_Connection.getSimpleUser(username);
                if(rs.next())   // if user exists
                {
                    ResultSet rs2 = DB_Connection.GetBloodTests(rs.getString("amka"));
                    //System.out.println("with amka : " + rs.getString("amka"));
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

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        response.setHeader("Content-Type", "text/plain");
        PrintWriter writer = response.getWriter();

        String json = null;
        JSON_Converter converter = new JSON_Converter();
        BufferedReader reader = request.getReader();
        json = converter.getJSONFromAjax(reader);   //get the form in json
        System.out.println("BloodTestServlet : " + json);   //to check if json is alright

        JsonParser parser = new JsonParser();
        JsonObject obj = parser.parse(json).getAsJsonObject();
        EditBloodTestTable btt = new EditBloodTestTable();
        try
        {
            mainClasses.BloodTest bt = new mainClasses.BloodTest();
            bt.setAmka(obj.get("amka").getAsString());          //maybe later add checking if amka is same as the logged in user's?
            bt.setTest_date(obj.get("test_date").getAsString());
            bt.setMedical_center(obj.get("medical_center").getAsString());
            if(obj.get("vitamin_d3") != null && obj.get("vitamin_d3").getAsString().length() != 0)
            {
                bt.setVitamin_d3(obj.get("vitamin_d3").getAsDouble());
                bt.setVitamin_d3_level();
            }
            else
                System.out.println("vitamin_d3 IS NULL");
            if(obj.get("vitamin_b12") != null && obj.get("vitamin_b12").getAsString().length() != 0)
            {
                bt.setVitamin_b12(obj.get("vitamin_b12").getAsDouble());
                bt.setVitamin_b12_level();
            }
            else
                System.out.println("vitamin_b12 IS NULL");
            if(obj.get("cholesterol") != null && obj.get("cholesterol").getAsString().length() != 0)
            {
                bt.setCholesterol(obj.get("cholesterol").getAsDouble());
                bt.setCholesterol_level();
            }
            else
                System.out.println("cholesterol IS NULL");
            if(obj.get("blood_sugar") != null && obj.get("blood_sugar").getAsString().length() != 0)
            {
                bt.setBlood_sugar(obj.get("blood_sugar").getAsDouble());
                bt.setBlood_sugar_level();
            }
            else
                System.out.println("blood_sugar IS NULL");
            if(obj.get("iron") != null && obj.get("iron").getAsString().length() != 0)
            {
                bt.setIron(obj.get("iron").getAsDouble());
                bt.setIron_level();
            }
            else
                System.out.println("iron IS NULL");


            //bt.setValues();
            btt.createNewBloodTest(bt);
            //btt.addBloodTestFromJSON(json); //things get fucked up with gson because of the empty strings
            response.setStatus(200);
            writer.write("added test");
        }
        catch(ClassNotFoundException e)
        {
            System.out.println("BloodTest servlet error");
            e.printStackTrace();
            response.setStatus(500);
            writer.write("Server error");
        }
    }
}
