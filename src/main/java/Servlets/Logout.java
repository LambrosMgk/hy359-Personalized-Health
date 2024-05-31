package Servlets;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.io.IOException;

@WebServlet(name = "Logout", value = "/Logout")
public class Logout extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        HttpSession session = request.getSession();

        if(session.getAttribute("loggedIn")!=null)
        {
            session.invalidate();
            response.setStatus(200);
            response.getWriter().write("Log out successful.");
        }
        else
        {
            response.getWriter().write("Not logged in.");
            response.setStatus(403);
        }
    }

}
