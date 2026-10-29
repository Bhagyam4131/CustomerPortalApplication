package com.vcube.customerportal.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vcube.customerportal.model.Customer;

@Repository
public interface CustomerRepo extends JpaRepository<Customer, Integer> {

    Customer findByEmail(String email);

}