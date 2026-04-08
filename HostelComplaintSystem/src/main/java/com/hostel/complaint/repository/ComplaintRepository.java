package com.hostel.complaint.repository;

import com.hostel.complaint.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStudentId(Long studentId);
}