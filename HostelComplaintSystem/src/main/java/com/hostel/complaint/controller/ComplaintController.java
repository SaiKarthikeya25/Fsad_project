package com.hostel.complaint.controller;

import com.hostel.complaint.model.Complaint;
import com.hostel.complaint.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:3000")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    // Student: Register Issue
    @PostMapping
    public Complaint createComplaint(@RequestBody Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    // Student: Track personal complaints
    @GetMapping("/student/{studentId}")
    public List<Complaint> getStudentComplaints(@PathVariable Long studentId) {
        return complaintRepository.findByStudentId(studentId);
    }

    // Warden: View all issues
    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // Warden/Admin: Update status (PENDING -> RESOLVED)
    @PatchMapping("/{id}/status")
    public Complaint updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow();
        complaint.setStatus(statusUpdate.get("status"));
        return complaintRepository.save(complaint);
    }
}