/*jshint esversion: 6 */
const mongoose = require('mongoose');
const config = require('./config.js');
const faker = require('faker');
const MongoClient = require('mongodb').MongoClient;


function createItems(count) {
    var items = [];
    for(let i=0; i<count; i++) {
        items.push({
            name: faker.commerce.product(),
            quantity: Math.floor(Math.random() * 10) + 1, // random no between 1 and 10
            rate: parseFloat(faker.commerce.price())
        });
    }
    return items;
}

// function contructor
function Bill({billNumber, billDate, items, discount, tax, customerId}) {
    this.billNumber = billNumber;
    this.billDate = billDate;
    this.items = items;
    this.discount = discount;
    this.tax = tax;
    this.customerId = customerId;
}

Bill.prototype.toString = function(){
    return this.items[0];
};


function createBill(billNumber, customerId) {
    var items = createItems(10); // get 10 items
    var data = {
        billNumber:  billNumber,
        billDate: faker.date.past(),
        tax: 15,
        discount: Math.floor(Math.random() * 25) + 1, // random no between 1 and 25
        items: items,
        customerId: customerId
    };
    return new Bill(data);
}


function getNextSequenceValue(db) {
    return new Promise((resolve, reject) => {
        db.collection('identitycounters').findOneAndUpdate({model: 'Bill'},
              {$inc: {sequence_value: 1, count: 1}}
           ).then(result => resolve(result.value.count), err => reject(err));
    });
}


function getRandomCustomerId(ids) {
    var index = Math.floor(Math.random() * ids.length);
    return ids[index];
}


var getCustomerIds = function(db) {
    db.collection('customers').find().toArray().then((customers) => {
        var ids = customers.map(customer => customer._id);
        var promises = [];
        for(let i=0; i<10; i++) {
            var random = getRandomCustomerId(ids);
            promises.push(addtoDb(db, random));
        }
        Promise.all(promises).then((results) => {
            console.log(results.length, 'bills added to db');
            db.close();
            process.exit();
            }, (err) => {
                console.log(err);
        });
        
    }, (err) => {
        reject(err);
    });
};


function addtoDb(db, customerId) {
    return new Promise((resolve, reject) => {
        getNextSequenceValue(db).then((sequence) => {
        var bill = createBill(sequence, customerId);
        console.log('adding to db bill', bill.toString());
        resolve(db.collection('bills').insert(bill));
        }, (err) => {
            reject(err);
        });
    });
}


MongoClient.connect(config.database, function(err, db) {
  
    console.log("Connected correctly to server");

    getCustomerIds(db);

});