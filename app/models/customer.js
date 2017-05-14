/*jshint esversion: 6 */
const mongoose = require('mongoose');


var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address']
    },
    addresses: [{
        flat: String,
        street: String,
        state: String,
        pincode: Number
    }],

});



mongoose.model('Customer', CustomerSchema);