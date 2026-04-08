package com.hostel.complaint.repository;

import com.hostel.complaint.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username); // This line MUST be here
}