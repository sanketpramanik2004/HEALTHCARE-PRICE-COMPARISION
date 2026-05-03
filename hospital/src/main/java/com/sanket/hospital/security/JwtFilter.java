package com.sanket.hospital.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtFilter implements Filter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            res.setStatus(HttpServletResponse.SC_OK);
            chain.doFilter(request, response);
            return;
        }

        String path = req.getRequestURI();

        if (isPublicEndpoint(path, req.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = req.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.getWriter().write("Missing or Invalid Token");
            return;
        }

        String token = authHeader.substring(7);

        try {
            String email = jwtUtil.extractEmail(token);

            req.setAttribute("userEmail", email);
            String role = jwtUtil.extractRole(token);
            Long hospitalId = jwtUtil.extractHospitalId(token);
            req.setAttribute("userRole", role);
            req.setAttribute("hospitalId", hospitalId);

            String pathReq = req.getRequestURI();

        if (isAdminOnlyEndpoint(pathReq, req.getMethod()) && !"ADMIN".equals(role)) {
                res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                res.getWriter().write("Access Denied: ADMIN only");
                return;
            }

            if (isUserOnlyEndpoint(pathReq, req.getMethod()) && !"USER".equals(role)) {
                res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                res.getWriter().write("Access Denied: USER only");
                return;
            }
        } catch (Exception e) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.getWriter().write("Invalid Token");
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String path, String method) {
        return path.contains("/login")
                || path.contains("/google-login")
                || path.contains("/register")
                || path.endsWith("/all")
                || path.contains("/search")
                || path.contains("/compare")
                || path.contains("/nearest")
                || path.contains("/best")
                || ("GET".equalsIgnoreCase(method) && path.matches("/reviews/doctor/\\d+"))
                || ("GET".equalsIgnoreCase(method) && path.matches("/reviews/hospital/\\d+"))
                || ("GET".equalsIgnoreCase(method) && path.matches("/reviews/doctor/\\d+/summary"))
                || ("GET".equalsIgnoreCase(method) && path.matches("/reviews/hospital/\\d+/summary"))
                || ("GET".equalsIgnoreCase(method) && path.equals("/doctors"))
                || ("GET".equalsIgnoreCase(method) && path.matches("/hospitals/\\d+/doctors"))
                || ("GET".equalsIgnoreCase(method) && path.matches("/doctors/\\d+/availableSlots"));
    }

    private boolean isAdminOnlyEndpoint(String path, String method) {
        return path.contains("/updateStatus")
                || path.equals("/hospitals/appointments")
                || path.contains("/myHospitalAppointments")
                || path.contains("/myHospitalServices")
                || path.contains("/addService")
                || path.endsWith("/add")
                || path.contains("/myHospitalProfile")
                || path.contains("/myHospitalSlots")
                || path.contains("/slots")
                || ("POST".equalsIgnoreCase(method) && path.equals("/doctors"))
                || ("DELETE".equalsIgnoreCase(method) && path.matches("/doctors/\\d+"));
    }

    private boolean isUserOnlyEndpoint(String path, String method) {
        return path.contains("/book")
                || path.contains("/myAppointments")
                || path.startsWith("/user/")
                || path.startsWith("/medical-history")
                || ("POST".equalsIgnoreCase(method) && path.equals("/reviews"))
                || path.equals("/reviews/mine");
    }
}
