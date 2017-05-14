/*jshint esversion: 6 */

const mongoose = require('mongoose'),  
      Customer = mongoose.model('Customer'),
      Bill = mongoose.model('Bill'),
      config = require('../../../config'),
      router = require('express').Router(),
      utils = require('../../utils');


router.post('/customer', (req, res) => {
    var customer = new Customer({
        name: req.body.name,
        mobile: req.body.mobile,
        phone: req.body.phone,
        dob: req.body.dob,
        email: req.body.email,
        addresses: req.body.addresses
     });

    customer.save().then(() => {
        return res.json({
            message: 'user created',
            sucess: true
        });
    })
    .catch((err) => {
            console.log(err);
            return res.status(400).json(err);
    });

});

router.route('/customer/:customerId')
    .delete((req, res) => {
        Customer.find({_id: req.params.customerId}).remove()
            .then((customer) => {
                return res.json({success: true, message: 'OK'});
            })
            .catch((err) => {
                return res.send({message: 'Invalid Customer Id', success: false}, 400);
            });
    })
    .get((req, res) => {
        Customer.findOne({_id: req.params.customerId})
            .then((customer) => {
                if (customer) {
                    return res.json(customer);
                }
                throw new Error('Not found');
                
            })
            .catch((err) => {
                return res.status(400).json({message: 'Invalid Customer Id', success: false});
            });
    })
    .put((req, res) => {
        Customer.findOneAndUpdate({_id: req.params.customerId}, req.body, function(err, doc){
                if (err) return res.send(500, { error: err });
                return res.json(doc);
            });
    });

router.route('/customers')
    .get((req, res) => {
        Customer.find({})
            .then((customers) =>{
                return res.json(customers);
            })
            .catch((err) => {
                return res.status(400).json(err);
            });
    });


router.route('/report')
    .get((req, res) => {
        utils.generateReport().then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(400).json(err);
        });
    });

module.exports = router;