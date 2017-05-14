/*jshint esversion: 6 */
const mongoose = require('mongoose'),
      config = require('./config.js'),
      faker = require('faker'),
      MongoClient = require('mongodb').MongoClient;


const NO_OF_BILL_ENTRIES = 1000;


/**
 * Return array of items having name, quantity, rate
 * @param {Number} count
 * @return {Array} items
 */
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


/**
 * function constructor
 */
function Bill({billNumber, billDate, items, discount, tax, customerId}) {
    this.billNumber = billNumber;
    this.billDate = billDate;
    this.items = items;
    this.discount = discount;
    this.tax = tax;
    this.customerId = customerId;
}

Bill.prototype.toString = function(){
    return `<${JSON.stringify(this.items[0])} - Customer: ${this.customerId}>`;
};


/**
 * Return instance of Bill
 * @param {Number} billNumber
 * @param {Number} customerId
 * @return {Object} Bill
 */
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


/**
 * Return next bill no sequence
 * @param {Object} db
 * @return {Promise} Bill
 */
function getNextBillNumber(db) {
    return new Promise((resolve, reject) => {
        db.collection('identitycounters').findOneAndUpdate({model: 'Bill'},
              {$inc: {sequence_value: 1, count: 1}}
           ).then(result => resolve(result.value.count), err => reject(err));
    });
}


/**
 * Return random customer id from list of ids
 * @param {Array} ids
 * @return {String} Customer Id
 */
function getRandomCustomerId(ids) {
    var index = Math.floor(Math.random() * ids.length);
    return ids[index];
}


/**
 * Runs db query to insert bill data in the collection
 * @param {Object} db
 * @param {String} customerId
 * @return {Promise}
 */
function addBillToDb(db, customerId) {
    return new Promise((resolve, reject) => {
        getNextBillNumber(db).then((sequence) => {
        var bill = createBill(sequence, customerId);
        console.log('adding to db bill', bill.toString());
        resolve(db.collection('bills').insert(bill));
        }, (err) => {
            reject(err);
        });
    });
}


/**
 * migrate data
 * @param {db} ids
 * @return {Promise} Customer Id
 */
var migrateData = function(db) {
    db.collection('customers').find().toArray().then((customers) => {
        var ids = customers.map(customer => customer._id);
        var promises = [];
        for(let i=0; i<NO_OF_BILL_ENTRIES; i++) {
            var random = getRandomCustomerId(ids);
            promises.push(addBillToDb(db, random));
        }
        Promise.all(promises).then((results) => {
            console.log(results.length, 'bills added to db');
            db.close();
            process.exit();
            }, (err) => {
                console.log(err);
        });
        
    }, (err) => {
        console.log(err);
    });
};


MongoClient.connect(config.database, function(err, db) {
  
    console.log('Connected correctly to server');
    console.log('Please wait .....');

    migrateData(db);

});