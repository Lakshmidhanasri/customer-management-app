const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all addresses of a customer
router.get('/customer/:customerId', (req, res) => {
    const sql = "SELECT * FROM addresses WHERE customer_id=?";
    db.all(sql, [req.params.customerId], (err, rows) => {
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'success', data: rows });
    });
});

// Add new address
router.post('/customer/:customerId', (req, res) => {
    const { address_details, city, state, pin_code } = req.body;
    if(!address_details || !city || !state || !pin_code){
        return res.status(400).json({ error: "All fields required" });
    }
    const sql = 'INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [req.params.customerId, address_details, city, state, pin_code], function(err){
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Address added', addressId: this.lastID });
    });
});

// Update address
router.put('/:id', (req, res) => {
    const { address_details, city, state, pin_code } = req.body;
    const sql = 'UPDATE addresses SET address_details=?, city=?, state=?, pin_code=? WHERE id=?';
    db.run(sql, [address_details, city, state, pin_code, req.params.id], function(err){
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Address updated' });
    });
});

// Delete address
router.delete('/:id', (req, res) => {
    const sql = 'DELETE FROM addresses WHERE id=?';
    db.run(sql, [req.params.id], function(err){
        if(err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Address deleted' });
    });
});

module.exports = router;
