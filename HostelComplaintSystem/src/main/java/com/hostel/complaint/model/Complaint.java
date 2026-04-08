package com.hostel.complaint.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private String category; // Food, Maintenance, Electricity
    private String status = "PENDING"; // PENDING, IN_PROGRESS, RESOLVED
    private String imageUrl;
    
    private Long studentId; // ID of the student who raised it
    private LocalDateTime createdAt = LocalDateTime.now();
}