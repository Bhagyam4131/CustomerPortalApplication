package com.vcube.customerportal.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vcube.customerportal.Repo.CustomerRepo;
import com.vcube.customerportal.model.Customer;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepo customerRepo;

    // Create customer
    @Override
    public Customer createCustomerData(Customer c) {
        return customerRepo.save(c);
    }

    // Get all customers
    @Override
    public List<Customer> getAllCustomerInfo() {
        return customerRepo.findAll();
    }

    // Get customer by ID
    @Override
    public Customer getCustomer(Integer id) {
        return customerRepo.findById(id).orElse(null);
    }

    // Update customer
    @Override
    public Customer updateData(Customer c, Integer id) {

        Customer customerFromDB = getCustomer(id);

        if (customerFromDB == null) {
            return null;
        }

        customerFromDB.setName(c.getName());
        customerFromDB.setAge(c.getAge());
        customerFromDB.setEmail(c.getEmail());
        customerFromDB.setState(c.getState());
        customerFromDB.setPhone(c.getPhone());
        customerFromDB.setCity(c.getCity());

        return customerRepo.save(customerFromDB);
    }

    // Delete customer
    @Override
    public void deleteCustomer(Integer id) {
        customerRepo.deleteById(id);
    }

    // Find customer by email
    @Override
    public Customer findByEmail(String email) {
        return customerRepo.findByEmail(email);
    }
}