/*jshint esversion: 6 */

const mongoose = require('mongoose'),
      Customer = mongoose.model('Customer'),
      Bill = mongoose.model('Bill');


function getConsulidateBillAmount(bills) {
    var consolidatedSum = 0;
    bills.forEach(function(bill) {
        consolidatedSum += bill.getTotalAmount();
    });
    return consolidatedSum;
}


function generateReport() {
    return new Promise((resolve, reject) => {
        var customerBillMap = {};
        Bill.find()
            .then((bills) => {
                bills.forEach(function(bill) {
                    if (!customerBillMap[bill.customerId]) {
                        customerBillMap[bill.customerId] = [];
                    }
                     customerBillMap[bill.customerId].push(bill);
                });
                return Customer.find();
            })
            .then((customers) => {
                var report = [];
                customers.forEach(function(customer) {
                    var customerBills = customerBillMap[customer._id] || [];
                    var amount = customerBills ? getConsulidateBillAmount(customerBills): 0;
                    var customerReport = {
                        name: customer.name,
                        mobile: customer.mobile,
                        phone: customer.phone,
                        noOfBills: customerBills.length,
                        amount: amount,
                        avgAmount: amount ? amount/customerBills.length : 0,
                    };
                    report.push(customerReport);
                });
                resolve(report);
            })
        .catch((err) => {
            reject(err);
        });
    });
}

module.exports = {
    generateReport: generateReport
};