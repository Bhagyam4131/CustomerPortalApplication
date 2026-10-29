package com.vcube.customerportal.service;

import java.util.List;

import com.vcube.customerportal.model.Customer;

// interface tells what to do
public interface CustomerService {

    // Created the Customer Data or Insert
    public abstract Customer createCustomerData(Customer c);

    // Get All the Customers Data
    public abstract List<Customer> getAllCustomerInfo();

    // Get one Customer Data Based on ID
    public abstract Customer getCustomer(Integer id);

    // Update all the Customer Data
    public abstract Customer updateData(Customer c, Integer id);

    // Delete the Data From DB Based on ID
    public abstract void deleteCustomer(Integer id);

    Customer findByEmail(String email);
}