package com.hostel.complaint.controller;

import com.hostel.complaint.model.User;
import com.hostel.complaint.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        // Line 18: Ensure findByUsername exists in your UserRepository interface
        User existingUser = userRepository.findByUsername(user.getUsername());

        if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
            return existingUser;
        }
        throw new RuntimeException("Invalid Credentials");
    }
}