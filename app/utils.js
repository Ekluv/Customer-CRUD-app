/*jshint esversion: 6 */
const mongoose = require('mongoose'),
    Customer = mongoose.model('Customer'),
    Bill = mongoose.model('Bill');


function getDiscountAmount(bill) {
    return bill.totalRate * bill.totalQuantity * bill.discount / 100;
}


function getTotalAmount(bill) {
    var discountAmount = getDiscountAmount(bill);
    var tax = discountAmount * bill.tax / 100;
    return bill.totalRate * bill.totalQuantity - discountAmount + tax;
}


function getConsulidateBillAmount(bills) {
    var consolidatedSum = 0;
    bills.forEach(function(bill) {
        consolidatedSum += getTotalAmount(bill);
    });
    return consolidatedSum;
}


function getBills() {
    return new Promise((resolve, reject) => {
        Bill.aggregate([{
            $unwind: "$items"
        }, {
            $group: {
                _id: {
                    billNumber: '$billNumber',
                    customerId: '$customerId',
                    discount: '$discount',
                    tax: '$tax'
                },
                totalRate: {
                    $sum: '$items.rate'
                },
                totalQuantity: {
                    $sum: '$items.quantity'
                }
            }
        }, {
            $project: {
                _id: 0,
                billNumber: '$_id.billNumber',
                customerId: '$_id.customerId',
                totalRate: '$totalRate',
                totalQuantity: '$totalQuantity',
                discount: '$_id.discount',
                tax: '$_id.tax'
            }
        }], (err, bills) => {
            if (err) reject(err);
            resolve(bills);
        });

    });
}


function generateReport() {
    return new Promise((resolve, reject) => {
        var customerBillMap = {};
        getBills().then((bills) => {
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
                    var amount = customerBills ? getConsulidateBillAmount(customerBills) : 0;
                    var customerReport = {
                        name: customer.name,
                        mobile: customer.mobile,
                        phone: customer.phone,
                        noOfBills: customerBills.length,
                        amount: amount,
                        avgAmount: amount ? amount / customerBills.length : 0,
                    };
                    report.push(customerReport);
                });
                resolve(report);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
}

module.exports = {
    generateReport: generateReport
};