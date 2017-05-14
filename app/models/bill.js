/*jshint esversion: 6 */
const mongoose = require('mongoose'),
      autoIncrement = require('mongoose-auto-increment'),
      config = require('../../config.js'),
      Customer = mongoose.model('Customer');

var connection = mongoose.createConnection(config.database);

autoIncrement.initialize(connection);

const BillSchema = new mongoose.Schema({
    billNumber: {type: Number},
    billDate: {type: Date, required: true},
    items: [{name: String, quantity: Number, rate: Number}],
    discount: {type: Number, default: 0},
    tax: {type: Number, default: 0},
    customerId: {type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},

});

BillSchema.methods.getSumOfRateAndQuantity = function() {
    var sumOfRate = 0,
    sumOfQuantity = 0;
    this.items.forEach(function(item, index) {
        sumOfRate += item.rate;
        sumOfQuantity += item.quantity;
    });
    return {sumOfQuantity, sumOfRate};
};

BillSchema.methods.getDiscountAmount = function() {
    var {sumOfQuantity, sumOfRate} = this.getSumOfRateAndQuantity();
    return sumOfRate * sumOfQuantity  * (this.discount/100);
};

BillSchema.methods.getTaxAmount = function() {
    return this.getDiscountAmount() * (this.tax/100);
};

BillSchema.methods.getTotalAmount = function() {
    var {sumOfQuantity, sumOfRate} = this.getSumOfRateAndQuantity();
    return sumOfRate * sumOfQuantity - this.getDiscountAmount() + this.getTaxAmount();
};

BillSchema.plugin(autoIncrement.plugin, { model: 'Bill', field: 'billNumber', startAt: 1});

mongoose.model('Bill', BillSchema);
