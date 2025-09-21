const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all customers
router.get('/', (req, res) => {
    let sql = "SELECT * FROM customers";
    const params = [];
    // Optional filters
    if(req.query.city){
        sql = `SELECT c.* FROM customers c 
               JOIN addresses a ON c.id=a.customer_id 
               WHERE a.city=?`;
        params.push(req.query.city);
    }
    db.all(sql, params, (err, rows) => {
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'success', data: rows });
    });
});

// Get customer by ID
router.get('/:id', (req, res) => {
    const sql = "SELECT * FROM customers WHERE id=?";
    db.get(sql, [req.params.id], (err, row) => {
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'success', data: row });
    });
});

// Create new customer
router.post('/', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    if(!first_name || !last_name || !phone_number){
        return res.status(400).json({ error: "All fields required" });
    }
    const sql = 'INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)';
    db.run(sql, [first_name, last_name, phone_number], function(err){
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Customer created', customerId: this.lastID });
    });
});

// Update customer
router.put('/:id', (req, res) => {
    const { first_name, last_name, phone_number } = req.body;
    const sql = "UPDATE customers SET first_name=?, last_name=?, phone_number=? WHERE id=?";
    db.run(sql, [first_name, last_name, phone_number, req.params.id], function(err){
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Customer updated' });
    });
});

// Delete customer
router.delete('/:id', (req, res) => {
    const sql = "DELETE FROM customers WHERE id=?";
    db.run(sql, [req.params.id], function(err){
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Customer deleted' });
    });
});

module.exports = router;
