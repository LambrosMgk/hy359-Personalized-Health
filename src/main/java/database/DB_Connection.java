package database;

import com.google.gson.JsonObject;

import javax.xml.transform.Result;
import java.sql.*;

public class DB_Connection {
    
    private static final String url = "jdbc:mysql://localhost";
    private static final String databaseName = "HY359";
    private static final int port = 3306;
    private static final String username = "root";
    private static final String password = "";

    /**
     * Attempts to establish a database connection
     *
     * @return a connection to the database
     * @throws SQLException
     * @throws java.lang.ClassNotFoundException
     */
    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName("com.mysql.jdbc.Driver");
        return DriverManager.getConnection(url + ":" + port + "/" + databaseName, username, password);
    }
    
    public static Connection getInitialConnection() throws SQLException, ClassNotFoundException {
        Class.forName("com.mysql.jdbc.Driver");
        return DriverManager.getConnection(url + ":" + port, username, password);
    }
    
      public static void printResults(ResultSet rs) throws SQLException {
        ResultSetMetaData metadata = rs.getMetaData();
        int columnCount = metadata.getColumnCount();
        
        String row = "";
        for (int i = 1; i <= columnCount; i++) {
            String name = metadata.getColumnName(i);
            String value = rs.getString(i);
            System.out.println(name + " " + value);
        }
    }
      
     public static String getResultsToJSON(ResultSet rs) throws SQLException {
       ResultSetMetaData metadata = rs.getMetaData();
        int columnCount = metadata.getColumnCount();
          JsonObject object = new JsonObject();
        
        
        String row = "";
        for (int i = 1; i <= columnCount; i++) {
            String name = metadata.getColumnName(i);
            String value = rs.getString(i);
            object.addProperty(name,value);
        }
        return object.toString();
    }

    //added these 5 functions to make searching easier
    public static ResultSet Search_User_Table(String row, String value) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;

        rs = stmt.executeQuery("SELECT "+ row +" FROM users WHERE "+ row +" = '" + value + "'");
        return rs;
    }

    public static ResultSet Search_User_Table_withanyvalue(String row, String value) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;

        rs = stmt.executeQuery("SELECT * FROM users WHERE "+ row +" = '" + value + "'");
        return rs;
    }

    public static ResultSet Search_Doctor_Table(String row, String value) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;

        rs = stmt.executeQuery("SELECT "+ row +" FROM doctors WHERE "+ row +" = '" + value + "'");
        return rs;
    }

    public static int Search_user_unique(String username, String email, String amka)
    {
        try
        {
            ResultSet rs = Search_User_Table("username", username);
            ResultSet rs2 = Search_User_Table("email", email);
            ResultSet rs3 = Search_User_Table("amka", amka);
            if(!rs.next() && !rs2.next() && !rs3.next())    //if username, email, amka unique...
            {
                rs = Search_Doctor_Table("username", username);
                rs2 = Search_Doctor_Table("email", email);
                rs3 = Search_Doctor_Table("amka", amka);
                if(!rs.next() && !rs2.next() && !rs3.next())//then check doctors table
                {
                    return 1;
                }
            }
        }
        catch(ClassNotFoundException e)
        {
            System.out.println("RegisterServlet : Class not found");
        }
        catch(SQLException e)
        {
            System.out.println("RegisterServlet : SQL exception");
        }
        return 0;   //if there is a user with that username or email or amka already
    }

    //ta getPasswordUser kai Doctor ta ekana gia na uparxoun xexwrista statements kai na mhn uparxei SQL error
    public static ResultSet getPasswordUser(String username) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "password" +" FROM users WHERE "+ "username" +" = '" + username + "'");

        return rs;
    }

    public static ResultSet getPasswordDoctor(String username) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "password" +" FROM doctors WHERE "+ "username" +" = '" + username + "' AND certified ='1'");

        return rs;
    }

    public static ResultSet getSimpleUser(String username) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM users WHERE "+ "username" +" = '" + username + "'");

        return rs;
    }

    public static ResultSet getSimpleUserById(String id) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM users WHERE "+ "user_id" +" = '" + id + "'");

        return rs;
    }

    public static ResultSet getDoctor(String username) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM doctors WHERE "+ "username" +" = '" + username + "'");    //i assume you are certified

        return rs;
    }

    public static void UpdateSimpleUser(String username, String email, String password, String firstname, String lastname, String birthdate, String gender,
    String country, String city, String address, String telephone, String height, String weight, String blooddonor, String bloodtype) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        int affectedRows;
        if(password.contentEquals(""))
        {
            affectedRows = stmt.executeUpdate("UPDATE " + "users" + " SET email='" + email + "'" +
                    ", firstname='" + firstname + "'" +
                    ", lastname='" + lastname + "'" +
                    ", birthdate='" + birthdate + "'" +
                    ", gender='" + gender + "'" +
                    ", country='" + country + "'" +
                    ", city='" + city + "'" +
                    ", address='" + address + "'" +
                    ", telephone='" + telephone + "'" +
                    ", height='" + height + "'" +
                    ", weight='" + weight + "'" +
                    ", blooddonor='" + blooddonor + "'" +
                    ", bloodtype='" + bloodtype + "'" +
                    " WHERE " + "username" + " = '" + username + "'");
        }
        else
        {
            affectedRows = stmt.executeUpdate("UPDATE " + "users" + " SET email='" + email + "'" +
                    ", password='" + password + "'" +
                    ", firstname='" + firstname + "'" +
                    ", lastname='" + lastname + "'" +
                    ", birthdate='" + birthdate + "'" +
                    ", gender='" + gender + "'" +
                    ", country='" + country + "'" +
                    ", city='" + city + "'" +
                    ", address='" + address + "'" +
                    ", telephone='" + telephone + "'" +
                    ", height='" + height + "'" +
                    ", weight='" + weight + "'" +
                    ", blooddonor='" + blooddonor + "'" +
                    ", bloodtype='" + bloodtype + "'" +
                    " WHERE " + "username" + " = '" + username + "'");
        }
        System.out.println("User rows affected : " + affectedRows);
    }

    public static void UpdateDoctor(String username, String email, String password, String doctor_info, String firstname, String lastname, String birthdate, String gender,
    String country, String city, String address, String telephone, String height, String weight, String blooddonor, String bloodtype) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        int affectedRows;
        if(password.contentEquals(""))
        {
            affectedRows = stmt.executeUpdate("UPDATE " + "doctors" + " SET email='" + email + "'" +
                    ", firstname='" + firstname + "'" +
                    ", lastname='" + lastname + "'" +
                    ", doctor_info='" + doctor_info + "'" +
                    ", birthdate='" + birthdate + "'" +
                    ", gender='" + gender + "'" +
                    ", country='" + country + "'" +
                    ", city='" + city + "'" +
                    ", address='" + address + "'" +
                    ", telephone='" + telephone + "'" +
                    ", height='" + height + "'" +
                    ", weight='" + weight + "'" +
                    ", blooddonor='" + blooddonor + "'" +
                    ", bloodtype='" + bloodtype + "'" +
                    " WHERE " + "username" + " = '" + username + "'");
        }
        else
        {
            affectedRows = stmt.executeUpdate("UPDATE " + "doctors" + " SET email='" + email + "'" +
                    ", password='" + password + "'" +
                    ", firstname='" + firstname + "'" +
                    ", lastname='" + lastname + "'" +
                    ", doctor_info='" + doctor_info + "'" +
                    ", birthdate='" + birthdate + "'" +
                    ", gender='" + gender + "'" +
                    ", country='" + country + "'" +
                    ", city='" + city + "'" +
                    ", address='" + address + "'" +
                    ", telephone='" + telephone + "'" +
                    ", height='" + height + "'" +
                    ", weight='" + weight + "'" +
                    ", blooddonor='" + blooddonor + "'" +
                    ", bloodtype='" + bloodtype + "'" +
                    " WHERE " + "username" + " = '" + username + "'");
        }
        System.out.println("Doctor rows affected : " + affectedRows);
    }

    public static ResultSet GetBloodTests(String amka) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM bloodtest WHERE amka = '" + amka + "' ORDER BY test_date DESC");

        return rs;
    }

    public static ResultSet GetBloodTestById(String bloodtest_id) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM bloodtest WHERE bloodtest_id = '" + bloodtest_id + "'");

        return rs;
    }

    public static ResultSet GetAllVerifiedDoctors() throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM doctors WHERE certified ='1'");

        return rs;
    }

    public static ResultSet GetAllRendezvous(String doctor_id) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM randevouz WHERE doctor_id='" + doctor_id + "'");

        return rs;
    }

    public static void DoctorUpdateRendezvous(String randevouzID, String price, String doctor_info) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        String updateQuery = "UPDATE randevouz SET price='" + price +"',doctor_info='" + doctor_info + "' WHERE randevouz_id = '" + randevouzID + "'";
        stmt.executeUpdate(updateQuery);
        stmt.close();
        con.close();
    }

    public static ResultSet GetRendezvous(String id) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM randevouz WHERE randevouz_id='" + id + "'");

        return rs;
    }

    public static int CancelRendezvous(String id) throws SQLException, ClassNotFoundException
    {
        ResultSet r = GetRendezvous(id);
        if(r.next())
        {
            String status = r.getString("status");
            if(!status.contentEquals("selected"))
            {
                System.out.println("Rendezvous must be selected first, it cannot be canceled if its free or done");
                return 0;
            }
        }

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        int rv = stmt.executeUpdate("UPDATE randevouz SET status='cancelled' WHERE randevouz_id = '" + id + "'");

        System.out.println("Rendezvous with id : " + id + " is canceled");
        return 1;
    }

    public static int SelectRendezvous(String id, String user_id) throws SQLException, ClassNotFoundException
    {
        ResultSet r = GetRendezvous(id);
        if(r.next())    //if rendezvous with id exist
        {
            String status = r.getString("status");
            if(!status.contentEquals("free"))   //could be selected, cancelled or done
            {
                System.out.println("Rendezvous is not free");
                return 0;
            }
        }

        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        int rv = stmt.executeUpdate("UPDATE randevouz SET status='selected', user_id='" + user_id +"' WHERE randevouz_id = '" + id + "'");

        System.out.println("Selected rendezvous with id : " + id);
        return 1;
    }

    public static ResultSet GetUserSelectedRendezvous(String user_id) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM randevouz WHERE user_id='" + user_id + "' AND status='selected'");

        return rs;
    }

    public static ResultSet GetUserDoneRendezvous(String user_id) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM randevouz WHERE user_id='" + user_id + "' AND status='done'");

        return rs;
    }

    public static ResultSet GetDoctorDoneRendezvous(String doctor_id) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT DISTINCT user_id FROM randevouz WHERE doctor_id='" + doctor_id + "' AND status='done'");

        return rs;
    }

    public static void UserUpdateRendezvous(String randevouzID, String user_info) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        stmt.executeUpdate("UPDATE randevouz SET user_info='" + user_info + "' WHERE randevouz_id='" + randevouzID + "'");

        stmt.close();
        con.close();
    }

    public static void UserGoToRendezvous(String randevouzID) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        stmt.executeUpdate("UPDATE randevouz SET status='done' WHERE randevouz_id='" + randevouzID + "'");

        stmt.close();
        con.close();
    }

    public static ResultSet GetAllUsers() throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM users");

        return rs;
    }

    public static ResultSet GetAllToVerifyDoctors() throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM doctors WHERE certified ='0'");

        return rs;
    }

    public static void VerifyDoctor(String doctor_id) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        stmt.executeUpdate("UPDATE doctors SET certified ='1' WHERE doctor_id='" + doctor_id + "'");

        stmt.close();
        con.close();
    }

    public static void DeleteDoctor(String doctor_id) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        stmt.executeUpdate("DELETE FROM doctors WHERE doctor_id='" + doctor_id + "'");

        stmt.close();
        con.close();
    }

    public static void DeleteUser(String user_id) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();

        stmt.executeUpdate("DELETE FROM users WHERE user_id='" + user_id + "'");

        stmt.close();
        con.close();
    }

    public static ResultSet GetTreatment(String user_id) throws SQLException, ClassNotFoundException
    {
        Connection con = DB_Connection.getConnection();
        Statement stmt = con.createStatement();
        ResultSet rs = stmt.executeQuery("SELECT "+ "*" +" FROM treatment WHERE user_id ='" + user_id + "'");

        return rs;
    }
}
